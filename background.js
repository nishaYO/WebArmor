console.log("i am working fine");
chrome.storage.local.get("blockedWebsites", function(data) {
    console.log(JSON.stringify(data));
});
