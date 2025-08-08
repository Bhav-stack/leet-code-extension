document.addEventListener('DOMContentLoaded', () => {
  const hintToggle = document.getElementById('hintToggle');
  const statusDiv = document.getElementById('status');
  const openLeetCodeBtn = document.getElementById('openLeetCode');
  const getHintBtn = document.getElementById('getHint');
  const getSolutionBtn = document.getElementById('getSolution');
  const githubBtn = document.getElementById('githubBtn');
  const helpBtn = document.getElementById('helpBtn');

  // Load initial toggle state from storage
  chrome.storage.local.get('hintFeatureEnabled', (data) => {
    hintToggle.checked = data.hintFeatureEnabled !== false; // Default to true if not set
    updateStatus();
    updateButtonStates();
  });

  // Listen for changes on the toggle switch
  hintToggle.addEventListener('change', () => {
    const isEnabled = hintToggle.checked;
    
    // Save to storage
    chrome.storage.local.set({ hintFeatureEnabled: isEnabled }, () => {
      console.log('Feature toggle saved:', isEnabled);
    });
    
    // Send message to background script to update state
    chrome.runtime.sendMessage({ 
      action: 'toggleFeatureState', 
      enabled: isEnabled 
    }, (response) => {
      if (response && response.success) {
        console.log('Feature toggle updated successfully');
      }
    });

    updateStatus();
    updateButtonStates();
  });

  // Open LeetCode button
  if (openLeetCodeBtn) {
    openLeetCodeBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://leetcode.com/problemset/' });
    });
  }

  // Get Hint button
  if (getHintBtn) {
    getHintBtn.addEventListener('click', () => {
      if (!hintToggle.checked) {
        showMessage('Please enable AI assistance first!', 'error');
        return;
      }
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        console.log('Hint - Current tab URL:', currentTab?.url);
        if (currentTab && currentTab.url && currentTab.url.includes('leetcode.com/problems/')) {
          console.log('Sending hint request to tab:', currentTab.id);
          chrome.tabs.sendMessage(currentTab.id, { action: 'requestHint' }, (response) => {
            if (chrome.runtime.lastError) {
              showMessage('Please refresh the LeetCode page and try again.', 'error');
              console.error('Content script error:', chrome.runtime.lastError);
            } else {
              showMessage('Hint request sent! Check the LeetCode page.', 'success');
              // Don't close immediately, let user see the message
              setTimeout(() => window.close(), 1500);
            }
          });
        } else {
          showMessage('Please navigate to a LeetCode problem first!', 'error');
        }
      });
    });
  }

  // Get Solution button
  if (getSolutionBtn) {
    getSolutionBtn.addEventListener('click', () => {
      if (!hintToggle.checked) {
        showMessage('Please enable AI assistance first!', 'error');
        return;
      }
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        console.log('Solution - Current tab URL:', currentTab?.url);
        if (currentTab && currentTab.url && currentTab.url.includes('leetcode.com/problems/')) {
          console.log('Sending solution request to tab:', currentTab.id);
          chrome.tabs.sendMessage(currentTab.id, { action: 'requestSolution' }, (response) => {
            if (chrome.runtime.lastError) {
              showMessage('Please refresh the LeetCode page and try again.', 'error');
              console.error('Content script error:', chrome.runtime.lastError);
            } else {
              showMessage('Solution request sent! Check the LeetCode page.', 'success');
              // Don't close immediately, let user see the message
              setTimeout(() => window.close(), 1500);
            }
          });
        } else {
          showMessage('Please navigate to a LeetCode problem first!', 'error');
        }
      });
    });
  }

  // GitHub button
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://github.com/your-username/leet-code-extension' });
    });
  }

  // Help button
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://github.com/your-username/leet-code-extension#readme' });
    });
  }

  // Update status display
  function updateStatus() {
    if (statusDiv) {
      const isEnabled = hintToggle.checked;
      statusDiv.textContent = isEnabled ? 'AI assistance is enabled' : 'AI assistance is disabled';
      statusDiv.className = isEnabled ? 'status enabled' : 'status disabled';
    }
  }

  // Update button states based on toggle
  function updateButtonStates() {
    const isEnabled = hintToggle.checked;
    
    if (getHintBtn) {
      getHintBtn.disabled = !isEnabled;
      getHintBtn.style.opacity = isEnabled ? '1' : '0.5';
      getHintBtn.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
    }
    
    if (getSolutionBtn) {
      getSolutionBtn.disabled = !isEnabled;
      getSolutionBtn.style.opacity = isEnabled ? '1' : '0.5';
      getSolutionBtn.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
    }
  }

  // Show temporary message
  function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      max-width: 280px;
      text-align: center;
      ${type === 'success' ? 'background: #4CAF50; color: white;' : 
        type === 'error' ? 'background: #F44336; color: white;' : 
        'background: #2196F3; color: white;'}
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }

  // Check current tab for LeetCode problem
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const problemInfo = document.getElementById('problemInfo');
    
    if (currentTab && currentTab.url && currentTab.url.includes('leetcode.com/problems/')) {
      const urlParts = currentTab.url.split('/');
      const problemSlug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
      
      if (problemInfo) {
        problemInfo.innerHTML = `
          <div class="problem-detected">
            <span class="indicator"></span>
            <strong>Problem Detected:</strong><br>
            <span class="problem-name">${problemSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        `;
      }
    } else {
      if (problemInfo) {
        problemInfo.innerHTML = `
          <div class="no-problem">
            <span class="indicator inactive"></span>
            Navigate to a LeetCode problem to get started
          </div>
        `;
      }
    }
  });
});