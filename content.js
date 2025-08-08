// content.js

// Function to detect the LeetCode problem slug from the URL
function getProblemSlug() {
  const url = window.location.href;
  debugLog('Checking URL for problem slug:', url);
  
  if (url.includes('leetcode.com/problems/')) {
    const match = url.match(/leetcode\.com\/problems\/([^\/\?]+)/);
    if (match && match[1]) {
      debugLog('Problem slug found:', match[1]);
      return match[1];
    }
  }
  debugLog('No problem slug found');
  return null;
}

// Function to get the full problem URL
function getProblemUrl() {
  return window.location.href;
}

// Function to get problem title from the page
function getProblemTitle() {
  debugLog('Attempting to get problem title...');
  
  // Wait a bit for the page to load
  const titleSelectors = [
    '[data-cy="question-title"]',
    'div[data-cy="question-title"]',
    '.text-title-large',
    '.css-v3d350',
    'h1[class*="title"]',
    'h1',
    '.question-title',
    '[class*="question-title"]',
    '[class*="problem-title"]',
    'div[class*="title"] h1',
    'div[class*="title"] span',
    '.text-lg.font-medium',
    '.text-xl.font-semibold'
  ];
  
  for (const selector of titleSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      debugLog(`Trying selector "${selector}", found ${elements.length} elements`);
      
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 200) {
          // Filter out common non-title texts
          if (!text.includes('Description') && 
              !text.includes('Example') && 
              !text.includes('Constraints') &&
              !text.includes('Follow up') &&
              !text.match(/^\d+\.\s*$/)) {
            debugLog('Problem title found:', text);
            return text;
          }
        }
      }
    } catch (e) {
      debugLog('Error with selector:', selector, e);
    }
  }
  
  // Fallback: try to extract from URL
  const slug = getProblemSlug();
  if (slug) {
    const titleFromSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    debugLog('Using title from slug:', titleFromSlug);
    return titleFromSlug;
  }
  
  debugLog('No problem title found, using default');
  return 'LeetCode Problem';
}

// Function to inject hint/solution directly into LeetCode page
function injectHintIntoPage(content, type = 'hint') {
  debugLog('Injecting content into page:', type);
  
  // Remove any existing hint/solution
  const existingHint = document.getElementById('leetsolveai-inline-hint');
  if (existingHint) {
    existingHint.remove();
  }

  // Find the best location to inject the hint
  const targetSelectors = [
    // Try problem description area first
    '[data-track-load="description_content"]',
    '.css-1jqueqk',
    '.question-content',
    '.content__u3I1',
    '.question-detail-main-tabs',
    '.css-12c3ojy',
    '.css-q9155a',
    '.description__24sA',
    // Try broader containers
    '[class*="question"]',
    '[class*="problem"]',
    '[class*="description"]',
    // Main content areas
    'main',
    '.main-content',
    '#app',
    '.app'
  ];

  let targetElement = null;
  for (const selector of targetSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      targetElement = elements[0];
      debugLog('Found target element with selector:', selector);
      break;
    }
  }

  // Fallback: use body
  if (!targetElement) {
    targetElement = document.body;
    debugLog('Using body as fallback target');
  }

  // Create the hint container
  const hintContainer = document.createElement('div');
  hintContainer.id = 'leetsolveai-inline-hint';
  hintContainer.style.cssText = `
    background: ${type === 'hint' ? '#FFF3E0' : '#E3F2FD'};
    border: 2px solid ${type === 'hint' ? '#FF9800' : '#2196F3'};
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 100%;
    word-wrap: break-word;
  `;

  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    color: ${type === 'hint' ? '#E65100' : '#1565C0'};
  `;

  const title = document.createElement('span');
  title.textContent = type === 'hint' ? '💡 AI Hint' : '🔧 AI Solution';
  title.style.fontSize = '16px';

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: ${type === 'hint' ? '#E65100' : '#1565C0'};
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeButton.onclick = () => hintContainer.remove();

  header.appendChild(title);
  header.appendChild(closeButton);

  // Create content area
  const contentArea = document.createElement('div');
  contentArea.style.cssText = `
    color: #333;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  `;
  
  // Format the content nicely
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin: 8px 0; overflow-x: auto;"><code>$1</code></pre>') // Code blocks
    .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>') // Inline code
    .replace(/•/g, '•'); // Ensure bullet points display correctly

  contentArea.innerHTML = formattedContent;

  hintContainer.appendChild(header);
  hintContainer.appendChild(contentArea);

  // Insert the hint
  if (targetElement === document.body) {
    // If using body, position it fixed at the top
    hintContainer.style.position = 'fixed';
    hintContainer.style.top = '20px';
    hintContainer.style.left = '20px';
    hintContainer.style.right = '20px';
    hintContainer.style.zIndex = '10000';
    targetElement.appendChild(hintContainer);
  } else {
    // Try to insert at the beginning, but handle errors gracefully
    try {
      if (targetElement.firstChild) {
        targetElement.insertBefore(hintContainer, targetElement.firstChild);
      } else {
        targetElement.appendChild(hintContainer);
      }
    } catch (e) {
      debugLog('Error inserting into target, using body:', e);
      document.body.appendChild(hintContainer);
      hintContainer.style.position = 'fixed';
      hintContainer.style.top = '20px';
      hintContainer.style.left = '20px';
      hintContainer.style.right = '20px';
      hintContainer.style.zIndex = '10000';
    }
  }

  // Scroll to the hint
  setTimeout(() => {
    hintContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  debugLog('Content injected successfully');
  return hintContainer;
}

// Function to show loading state inline
function showInlineLoading(type = 'hint') {
  const loadingMessage = type === 'hint' ? 'Generating hint...' : 'Generating solution...';
  
  const loadingContent = `
    <div style="display: flex; align-items: center; gap: 12px; color: #666;">
      <div style="
        width: 20px;
        height: 20px;
        border: 2px solid #ddd;
        border-top: 2px solid #FF9800;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <span>${loadingMessage}</span>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  injectHintIntoPage(loadingContent, type);
}

// Updated function to request hint
function requestHint() {
  debugLog('Hint requested');
  const problemSlug = getProblemSlug();
  const problemTitle = getProblemTitle();
  
  debugLog('Problem details:', { slug: problemSlug, title: problemTitle });
  
  if (!problemSlug) {
    injectHintIntoPage('❌ Unable to detect LeetCode problem. Please make sure you are on a problem page.\n\nCurrent URL: ' + window.location.href, 'hint');
    return;
  }

  showInlineLoading('hint');

  chrome.runtime.sendMessage({
    action: 'getHint',
    problemSlug: problemSlug,
    problemTitle: problemTitle
  });
}

// Updated function to request solution
function requestSolution() {
  debugLog('Solution requested');
  const problemSlug = getProblemSlug();
  const problemTitle = getProblemTitle();
  
  debugLog('Problem details:', { slug: problemSlug, title: problemTitle });
  
  if (!problemSlug) {
    injectHintIntoPage('❌ Unable to detect LeetCode problem. Please make sure you are on a problem page.\n\nCurrent URL: ' + window.location.href, 'solution');
    return;
  }

  showInlineLoading('solution');

  chrome.runtime.sendMessage({
    action: 'getSolution',
    problemSlug: problemSlug,
    problemTitle: problemTitle
  });
}

// Listen for messages from background script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugLog('Received message:', request.action);
  
  if (request.action === 'displayHint') {
    injectHintIntoPage(request.hint, 'hint');
  } else if (request.action === 'displaySolution') {
    injectHintIntoPage(request.solution, 'solution');
  } else if (request.action === 'displayError') {
    injectHintIntoPage(`❌ Error: ${request.error}`, 'hint');
  } else if (request.action === 'requestHint') {
    requestHint();
  } else if (request.action === 'requestSolution') {
    requestSolution();
  }
  sendResponse({ success: true });
});

// Debug logging function
function debugLog(message, data = null) {
  console.log(`[LeetSolveAI] ${message}`, data || '');
}

// Initialize when page loads
function initialize() {
  debugLog('Initializing LeetSolveAI...');
  debugLog('Current URL:', window.location.href);
  
  // Wait a bit for the page to fully load
  setTimeout(() => {
    const problemSlug = getProblemSlug();
    const problemTitle = getProblemTitle();
    
    debugLog('Problem detection results:', { slug: problemSlug, title: problemTitle });
    
    // Check if we're on a LeetCode problem page
    if (problemSlug) {
      debugLog('LeetCode problem detected');
      
      // Notify background script about problem detection
      chrome.runtime.sendMessage({
        action: 'problemDetected',
        slug: problemSlug,
        title: problemTitle,
        url: getProblemUrl()
      }, (response) => {
        debugLog('Background script response:', response);
      });
    } else {
      debugLog('Not on a LeetCode problem page');
    }
  }, 2000); // Wait 2 seconds for page to load
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initialize, 1000);
  });
} else {
  // Page is already loaded
  setTimeout(initialize, 1000);
}

// Listen for URL changes (LeetCode is a SPA)
let currentUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    debugLog('URL changed to:', currentUrl);
    // Small delay to let the page content load
    setTimeout(initialize, 3000);
  }
});

// Start observing when body is available
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Also listen for popstate events
window.addEventListener('popstate', () => {
  debugLog('Popstate event detected');
  setTimeout(initialize, 1000);
});

// Add a manual trigger for testing
window.leetSolveAITest = () => {
  debugLog('Manual test triggered');
  const problemSlug = getProblemSlug();
  const problemTitle = getProblemTitle();
  debugLog('Test results:', { slug: problemSlug, title: problemTitle });
  
  // Test injection
  injectHintIntoPage(`🧪 Test injection successful!\n\nProblem: ${problemTitle}\nSlug: ${problemSlug}\nURL: ${window.location.href}`, 'hint');
};

debugLog('Content script loaded');