document.addEventListener('DOMContentLoaded', function () {
    const editListBtn = document.getElementById('editListBtn');
    const blockedWebsitesContainer = document.getElementById('blockedWebsites');

    // Handle Edit List button click
    editListBtn.addEventListener('click', function () {
        // Add logic to handle editing the list
        // This could involve opening a new tab or window to a settings page
    });

    // Fetch the list of blocked websites from rules.json
    chrome.runtime.getPackageDirectoryEntry(function (root) {
        root.getFile('rules.json', {}, function (fileEntry) {
            fileEntry.file(function (file) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const rules = JSON.parse(reader.result);
                    const blockedWebsites = rules.map(rule => rule.condition.urlFilter);
                    blockedWebsitesContainer.innerHTML = blockedWebsites.join('<br>');
                };
                reader.readAsText(file);
            });
        });
    });
});
