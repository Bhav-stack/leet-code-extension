document.addEventListener('DOMContentLoaded', () => {
  const hintToggle = document.getElementById('hintToggle');

  // Load initial toggle state from storage
  chrome.storage.local.get('hintFeatureEnabled', (data) => {
    hintToggle.checked = data.hintFeatureEnabled !== false; // Default to true if not set
  });

  // Listen for changes on the toggle switch
  hintToggle.addEventListener('change', () => {
    const isEnabled = hintToggle.checked;
    // Send message to background script to update state
    chrome.runtime.sendMessage({ type: 'toggleHintFeature', enabled: isEnabled });
  });
});