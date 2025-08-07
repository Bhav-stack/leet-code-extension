chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getFeatureToggleState") {
    chrome.storage.local.get('hintFeatureEnabled', (data) => {
      sendResponse({ enabled: data.hintFeatureEnabled !== false }); // Default to true if not set
    });
    return true; // Indicates that the response will be sent asynchronously
  } else if (request.action === "toggleFeatureState") {
    chrome.storage.local.set({ hintFeatureEnabled: request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response will be sent asynchronously
  } else if (request.action === "problemDetected") {
    const problemSlug = request.slug;
    console.log("Problem detected:", problemSlug);
    // Placeholder for AI API call
    getAIHint(problemSlug).then(hint => {
      // Send hint back to content script or popup
      console.log("Generated hint:", hint);
    }).catch(error => {
      console.error("Error generating hint:", error);
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

// Function to get AI hint by calling the serverless function
async function getAIHint(problemSlug) {
  try {
    const response = await fetch('http://localhost:3000/api/hint', { // Replace with your serverless function URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemSlug: problemSlug }),
    });
    const data = await response.json();
 if (data.hint) {
 return data.hint;
    } else {
 throw new Error(data.error || 'Unknown error fetching hint');
    }
  } catch (error) {
    console.error('Error fetching AI hint:', error);
    return `Failed to get AI hint for ${problemSlug}. Error: ${error.message}`;
  }
}