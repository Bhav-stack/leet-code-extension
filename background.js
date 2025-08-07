// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  if (request.action === "getFeatureToggleState") {
    chrome.storage.local.get('hintFeatureEnabled', (data) => {
      sendResponse({ enabled: data.hintFeatureEnabled !== false }); // Default to true if not set
    });
    return true; // Indicates that the response will be sent asynchronously
    
  } else if (request.action === "toggleFeatureState") {
    chrome.storage.local.set({ hintFeatureEnabled: request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
    
  } else if (request.action === "problemDetected") {
    const problemSlug = request.slug;
    console.log("Problem detected:", problemSlug, request.title);
    sendResponse({ success: true });
    return true;
    
  } else if (request.action === "getHint") {
    handleHintRequest(request, sender);
    return true;
    
  } else if (request.action === "getSolution") {
    handleSolutionRequest(request, sender);
    return true;
  }
});

// Function to handle hint requests
async function handleHintRequest(request, sender) {
  try {
    // Check if feature is enabled
    const result = await chrome.storage.local.get('hintFeatureEnabled');
    if (result.hintFeatureEnabled === false) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'displayError',
        error: 'Hint feature is disabled. Please enable it in the extension popup.'
      });
      return;
    }

    const hint = await getAIHint(request.problemSlug, request.problemTitle);
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displayHint',
      hint: hint
    });
  } catch (error) {
    console.error('Error handling hint request:', error);
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displayError',
      error: `Failed to get hint: ${error.message}`
    });
  }
}

// Function to handle solution requests
async function handleSolutionRequest(request, sender) {
  try {
    // Check if feature is enabled
    const result = await chrome.storage.local.get('hintFeatureEnabled');
    if (result.hintFeatureEnabled === false) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'displayError',
        error: 'Solution feature is disabled. Please enable it in the extension popup.'
      });
      return;
    }

    const solution = await getAISolution(request.problemSlug, request.problemTitle);
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displaySolution',
      solution: solution
    });
  } catch (error) {
    console.error('Error handling solution request:', error);
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'displayError',
      error: `Failed to get solution: ${error.message}`
    });
  }
}

// Function to get AI hint
async function getAIHint(problemSlug, problemTitle) {
  try {
    // Try the Next.js API first, fallback to direct AI call
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        problemSlug: problemSlug,
        problemTitle: problemTitle,
        type: 'hint'
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.hint) {
      return data.hint;
    } else {
      throw new Error(data.error || 'Unknown error fetching hint');
    }
  } catch (error) {
    console.error('Error fetching AI hint:', error);
    // Fallback to a generic hint
    return `💡 Hint for "${problemTitle || problemSlug}":

This problem likely involves one of these common patterns:
• Array/String manipulation
• Two pointers technique
• Hash map for O(1) lookups
• Dynamic programming for optimization
• Tree/Graph traversal (BFS/DFS)
• Sliding window for subarray problems

Try to identify the core pattern first, then think about the optimal approach.

Note: Unable to connect to AI service. This is a generic hint.`;
  }
}

// Function to get AI solution
async function getAISolution(problemSlug, problemTitle) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        problemSlug: problemSlug,
        problemTitle: problemTitle,
        type: 'solution'
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.solution || data.hint) {
      return data.solution || data.hint;
    } else {
      throw new Error(data.error || 'Unknown error fetching solution');
    }
  } catch (error) {
    console.error('Error fetching AI solution:', error);
    // Fallback to a generic solution template
    return `🔧 Solution approach for "${problemTitle || problemSlug}":

1. **Understand the problem**: Read carefully and identify inputs/outputs
2. **Choose the right data structure**: Array, HashMap, Set, Stack, Queue, etc.
3. **Plan your algorithm**: 
   - Brute force first (if needed)
   - Optimize using appropriate patterns
4. **Code structure**:
   \`\`\`python
   def solution(input_params):
       # Initialize variables
       # Main logic here
       # Return result
   \`\`\`
5. **Test with examples**: Verify with given test cases
6. **Analyze complexity**: Time and space complexity

Note: Unable to connect to AI service. Please check your internet connection.`;
  }
}

// Function to determine API URL
function getApiUrl() {
  // In development, use localhost. In production, this would be your deployed URL
  return 'http://localhost:9002';
}