console.log("I am working fine");

chrome.storage.local.get("blockedWebsites", function (data) {
    const blockedWebsites = JSON.parse(data.blockedWebsites || "[]"); // Parse the stored JSON string
    
    // Create the rules in the required format
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

    // Log the formatted rules
    console.log(formattedRules);

    // Store the formatted rules in Chrome storage
    chrome.storage.local.set({ "formattedRules": formattedRules }, function () {
        console.log("Formatted rules stored successfully.");
    });
});

// Function to update rules.json content based on stored data
function updateRulesJson(rules) {
    const rulesJson = JSON.stringify(rules, null, 4);
    
    // Communicate with the popup script to update rules.json
    chrome.runtime.sendMessage({ action: "updateRulesJson", rules: rulesJson }, function(response) {
        console.log(response);
        if (response && response.success) {
            console.log("rules.json updated successfully.");
        } else {
            console.error("Failed to update rules.json:", response.error);
        }
    });
}
