// content.js

// Function to detect the LeetCode problem slug from the URL
function getProblemSlug() {
  const url = window.location.href;
  if (url.startsWith('https://leetcode.com/problems/')) {
    const parts = url.split('/');
    // The problem slug is typically the 4th part: https://leetcode.com/problems/[slug]/
    return parts[4] || null;
  }
  return null;
}

// Function to get the full problem URL
function getProblemUrl() {
  return window.location.href;
}

// Function to get problem title from the page
function getProblemTitle() {
  // Try multiple selectors as LeetCode might change their structure
  const titleSelectors = [
    '[data-cy="question-title"]',
    '.text-title-large',
    '.css-v3d350',
    'h1',
    '.question-title'
  ];
  
  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  return 'Unknown Problem';
}

// Function to create and inject the hint/solution UI
function createLeetSolveAIUI() {
  // Check if UI already exists
  if (document.getElementById('leetsolveai-container')) {
    return;
  }

  // Create the main container
  const container = document.createElement('div');
  container.id = 'leetsolveai-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: none;
  `;

  // Create the header
  const header = document.createElement('div');
  header.style.cssText = `
    background: #3F51B5;
    color: white;
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
  `;
  header.innerHTML = `
    <span>🧠 LeetSolveAI</span>
    <button id="leetsolveai-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; width: 20px; height: 20px;">&times;</button>
  `;

  // Create the content area
  const content = document.createElement('div');
  content.id = 'leetsolveai-content';
  content.style.cssText = `
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
  `;

  // Create action buttons
  const actions = document.createElement('div');
  actions.style.cssText = `
    padding: 12px 16px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 8px;
  `;

  const hintButton = document.createElement('button');
  hintButton.id = 'leetsolveai-hint-btn';
  hintButton.textContent = 'Get Hint';
  hintButton.style.cssText = `
    flex: 1;
    background: #FF9800;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    transition: background-color 0.2s;
  `;
  hintButton.onmouseover = () => hintButton.style.background = '#F57C00';
  hintButton.onmouseout = () => hintButton.style.background = '#FF9800';

  const solutionButton = document.createElement('button');
  solutionButton.id = 'leetsolveai-solution-btn';
  solutionButton.textContent = 'Get Solution';
  solutionButton.style.cssText = `
    flex: 1;
    background: #3F51B5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    transition: background-color 0.2s;
  `;
  solutionButton.onmouseover = () => solutionButton.style.background = '#303F9F';
  solutionButton.onmouseout = () => solutionButton.style.background = '#3F51B5';

  actions.appendChild(hintButton);
  actions.appendChild(solutionButton);

  container.appendChild(header);
  container.appendChild(content);
  container.appendChild(actions);

  // Add event listeners
  document.getElementById = (id) => container.querySelector(`#${id}`) || document.querySelector(`#${id}`);
  
  header.querySelector('#leetsolveai-close').addEventListener('click', () => {
    container.style.display = 'none';
  });

  hintButton.addEventListener('click', () => {
    requestHint();
  });

  solutionButton.addEventListener('click', () => {
    requestSolution();
  });

  // Append to body
  document.body.appendChild(container);

  return container;
}

// Function to show the UI
function showLeetSolveAIUI() {
  const container = document.getElementById('leetsolveai-container');
  if (container) {
    container.style.display = 'block';
  }
}

// Function to update the content
function updateUIContent(content, type = 'info') {
  const contentDiv = document.getElementById('leetsolveai-content');
  if (contentDiv) {
    const typeColors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };

    contentDiv.innerHTML = `
      <div style="
        padding: 12px;
        background: ${typeColors[type]}15;
        border-left: 4px solid ${typeColors[type]};
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
      ">${content}</div>
    `;
  }
}

// Function to show loading state
function showLoading(message = 'Loading...') {
  updateUIContent(`
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="
        width: 16px;
        height: 16px;
        border: 2px solid #3F51B5;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      ${message}
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `, 'info');
}

// Function to request hint
function requestHint() {
  const problemSlug = getProblemSlug();
  if (!problemSlug) {
    updateUIContent('Unable to detect LeetCode problem. Please make sure you are on a problem page.', 'error');
    showLeetSolveAIUI();
    return;
  }

  showLoading('Generating hint...');
  showLeetSolveAIUI();

  chrome.runtime.sendMessage({
    action: 'getHint',
    problemSlug: problemSlug,
    problemTitle: getProblemTitle()
  });
}

// Function to request solution
function requestSolution() {
  const problemSlug = getProblemSlug();
  if (!problemSlug) {
    updateUIContent('Unable to detect LeetCode problem. Please make sure you are on a problem page.', 'error');
    showLeetSolveAIUI();
    return;
  }

  showLoading('Generating solution...');
  showLeetSolveAIUI();

  chrome.runtime.sendMessage({
    action: 'getSolution',
    problemSlug: problemSlug,
    problemTitle: getProblemTitle()
  });
}

// Listen for messages from background script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displayHint') {
    updateUIContent(request.hint, 'success');
    showLeetSolveAIUI();
  } else if (request.action === 'displaySolution') {
    updateUIContent(request.solution, 'success');
    showLeetSolveAIUI();
  } else if (request.action === 'displayError') {
    updateUIContent(request.error, 'error');
    showLeetSolveAIUI();
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
  
  const problemSlug = getProblemSlug();
  debugLog('Problem slug detected:', problemSlug);
  
  // Check if we're on a LeetCode problem page
  if (problemSlug) {
    debugLog('Creating UI for problem:', problemSlug);
    createLeetSolveAIUI();
    
    // Show the UI immediately with welcome message
    updateUIContent(`🎯 Problem detected: "${getProblemTitle()}"\n\nClick "Get Hint" for guidance or "Get Solution" for the complete answer.`, 'info');
    showLeetSolveAIUI();
    debugLog('UI should now be visible');
    
    // Notify background script about problem detection
    chrome.runtime.sendMessage({
      action: 'problemDetected',
      slug: problemSlug,
      title: getProblemTitle(),
      url: getProblemUrl()
    }, (response) => {
      debugLog('Background script response:', response);
    });
  } else {
    debugLog('Not on a LeetCode problem page');
    // Hide UI if it exists
    const container = document.getElementById('leetsolveai-container');
    if (container) {
      container.style.display = 'none';
    }
  }
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
    setTimeout(initialize, 2000);
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
  initialize();
};

debugLog('Content script loaded');