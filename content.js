// content.js

// Function to detect the LeetCode problem slug from the URL
function getProblemSlug() {
  // LeetCode problem URLs usually follow a pattern like https://leetcode.com/problems/problem-title/
  const url = window.location.href;
  if (url.startsWith('https://leetcode.com/problems/')) {
    const parts = url.split('/');
    // The problem slug is typically the second to last part of the URL
    return parts[parts.length - 2];
  }
  return null; // Not a LeetCode problem page
}

// Send the problem URL to the background script when the page loads
window.onload = function() {
  const problemUrl = getProblemUrl();
  if (problemUrl) {
    chrome.runtime.sendMessage({ type: "problemUrl", url: problemUrl });
  }
};

// Listen for messages from the background script (e.g., for hints or solutions)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "displayHint") {
    // TODO: Implement logic to display the hint on the page
    console.log("Received hint:", request.hint);
    // For now, we'll just log it. You would likely inject a UI element here.
  } else if (request.type === "displaySolution") {
    // TODO: Implement logic to display the solution on the page
    console.log("Received solution:", request.solution);
    // For now, we'll just log it. You would likely inject a UI element here.
  }
});