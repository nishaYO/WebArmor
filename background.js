import defaultBlockedWebsites from "./defaultBlockedWebsites.js";

chrome.runtime.onInstalled.addListener(function () {
  // Load the list from Chrome storage
  chrome.storage.local.get("blockedWebsites", function (data) {
    let blockedWebsites = data.blockedWebsites;

    // if key not found then store default websites as blocked websites
    if (!blockedWebsites) {
      blockedWebsites = defaultBlockedWebsites;
      chrome.storage.local.set(
        { blockedWebsites: JSON.stringify(defaultBlockedWebsites) },
        () => {console.log("default websites stored in localstorage.")}
      );
    }

    // Convert to array if it's not already
    if (!Array.isArray(blockedWebsites)) {
        blockedWebsites = [blockedWebsites];
        chrome.storage.local.set(
          { blockedWebsites: JSON.stringify(blockedWebsites) },
          () => {
            console.log("Converted 'blockedWebsites' to array.");
          }
        );
      }

    // Format the list into the required JSON format for declarativeNetRequest
    const formattedRules = blockedWebsites.map((website, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "block",
      },
      condition: {
        urlFilter: website,
      },
    }));

    // Set up the rules for blocking websites
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: formattedRules,
      removeRuleIds: [], // No rules to remove initially
    });
  });
});

// Listener for reloading the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "reloadExtension") {
    chrome.runtime.reload();
  }
});
