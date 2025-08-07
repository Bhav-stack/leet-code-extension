import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemSlug, problemTitle, type = 'hint' } = body;

    if (!problemSlug) {
      return NextResponse.json(
        { error: 'Missing problemSlug in request body' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'solution') {
      result = await generateSolution(problemSlug, problemTitle);
      return NextResponse.json({ solution: result });
    } else {
      result = await generateHint(problemSlug, problemTitle);
      return NextResponse.json({ hint: result });
    }
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Error generating response' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Function to generate hint using AI
async function generateHint(problemSlug: string, problemTitle?: string): Promise<string> {
  const hf_api_token = process.env.HF_API_TOKEN;
  
  if (!hf_api_token) {
    return generateFallbackHint(problemSlug, problemTitle);
  }

  try {
    const prompt = `Provide a helpful hint for the LeetCode problem "${problemTitle}" (slug: ${problemSlug}). 
    The hint should:
    - Not give away the complete solution
    - Guide the user toward the right approach
    - Mention relevant algorithms or data structures
    - Be encouraging and educational
    
    Format the response as a clear, concise hint.`;

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      headers: { 
        'Authorization': `Bearer ${hf_api_token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();
    const hint = result[0]?.generated_text || result.generated_text;
    
    if (hint && hint.trim()) {
      return `💡 **Hint for ${problemTitle}:**\n\n${hint.trim()}`;
    } else {
      throw new Error('Empty response from AI');
    }
  } catch (error) {
    console.error('AI hint generation failed:', error);
    return generateFallbackHint(problemSlug, problemTitle);
  }
}

// Function to generate solution using AI
async function generateSolution(problemSlug: string, problemTitle?: string): Promise<string> {
  const hf_api_token = process.env.HF_API_TOKEN;
  
  if (!hf_api_token) {
    return generateFallbackSolution(problemSlug, problemTitle);
  }

  try {
    const prompt = `Provide a complete solution for the LeetCode problem "${problemTitle}" (slug: ${problemSlug}).
    Include:
    - Problem analysis
    - Algorithm explanation
    - Code implementation (Python preferred)
    - Time and space complexity
    - Key insights
    
    Format the response clearly with sections.`;

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      headers: { 
        'Authorization': `Bearer ${hf_api_token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();
    const solution = result[0]?.generated_text || result.generated_text;
    
    if (solution && solution.trim()) {
      return `🔧 **Solution for ${problemTitle}:**\n\n${solution.trim()}`;
    } else {
      throw new Error('Empty response from AI');
    }
  } catch (error) {
    console.error('AI solution generation failed:', error);
    return generateFallbackSolution(problemSlug, problemTitle);
  }
}

// Fallback hint generation
function generateFallbackHint(problemSlug: string, problemTitle?: string): string {
  const commonPatterns: Record<string, string> = {
    'two-sum': 'Consider using a hash map to store complements as you iterate through the array.',
    'add-two-numbers': 'Think about how you add numbers digit by digit, handling carry-over.',
    'longest-substring-without-repeating-characters': 'Use the sliding window technique with a hash set.',
    'median-of-two-sorted-arrays': 'Binary search on the smaller array to find the partition.',
    'longest-palindromic-substring': 'Consider expanding around centers or dynamic programming.',
    'reverse-integer': 'Handle overflow carefully and reverse digit by digit.',
    'string-to-integer-atoi': 'Handle edge cases: whitespace, signs, overflow, and invalid characters.',
    'palindrome-number': 'Can you solve it without converting to string? Reverse half the number.',
    'container-with-most-water': 'Use two pointers from both ends, move the pointer with smaller height.',
    'integer-to-roman': 'Use greedy approach with largest values first.',
  };

  const specificHint = commonPatterns[problemSlug];
  
  if (specificHint) {
    return `💡 **Hint for ${problemTitle}:**\n\n${specificHint}\n\nTry to implement this approach step by step!`;
  }

  // Generic hints based on common problem patterns
  const genericHints = [
    "Consider if this problem can be solved with two pointers technique.",
    "Think about whether a hash map could help you achieve O(1) lookups.",
    "Could dynamic programming help optimize overlapping subproblems?",
    "Is this a tree/graph traversal problem? Consider BFS or DFS.",
    "Would a sliding window approach work for this array/string problem?",
    "Can you use a stack or queue to solve this problem efficiently?",
    "Think about the greedy approach - can you make locally optimal choices?",
    "Consider if binary search could reduce the time complexity."
  ];

  const randomHint = genericHints[Math.floor(Math.random() * genericHints.length)];
  
  return `💡 **Hint for ${problemTitle}:**\n\n${randomHint}\n\nAnalyze the problem constraints and think about the most suitable data structure and algorithm.`;
}

// Fallback solution generation
function generateFallbackSolution(problemSlug: string, problemTitle?: string): string {
  return `🔧 **Solution Approach for ${problemTitle}:**

**Step 1: Understand the Problem**
- Read the problem statement carefully
- Identify input and output formats
- Note any constraints

**Step 2: Plan Your Approach**
- Start with a brute force solution if needed
- Think about optimizations
- Consider edge cases

**Step 3: Choose Data Structures**
- Arrays for sequential data
- Hash maps for fast lookups
- Stacks for LIFO operations
- Queues for BFS
- Sets for uniqueness

**Step 4: Implementation Template**
\`\`\`python
def solution(params):
    # Initialize variables
    
    # Main algorithm logic
    
    # Return result
    pass
\`\`\`

**Step 5: Test and Optimize**
- Test with provided examples
- Consider time and space complexity
- Optimize if needed

**Note:** This is a general template. For a specific AI-generated solution, please ensure you have a valid HF_API_TOKEN configured.`;
}