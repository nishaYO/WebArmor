const defaultBlockedWebsites = [
  "*://adsense.google.com/start/*",
  "*://*googleadservices.com/*",
  "*://.doubleclick.net/*",
  "*://partner.googleadservices.com/*",
  "*://.googlesyndication.com/*",
  "*://.google-analytics.com/*",
  "*://creative.ak.fbcdn.net/*",
  "*://.adbrite.com/*",
  "*://.exponential.com/*",
  "*://.quantserve.com/*",
  "*://.scorecardresearch.com/*",
  "*://.zedo.com/*",
  "*://.googletagmanager.com/*",
  "*://.px.ads.linkedin.com/*",
  "*://.twitter.com/*"
];

chrome.runtime.onInstalled.addListener(function () {
  // Load the list from Chrome storage
  chrome.storage.local.get("blockedWebsites", function (data) {
    let blockedWebsites = data.blockedWebsites;
    console.log(blockedWebsites)
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
      // here is some problem that the list of blockedwebsites is shown
      // console.log the blockedwebsites and then fix the issue with array type
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
      id: hash(website),
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

function hash(str) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}