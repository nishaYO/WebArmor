document.addEventListener("DOMContentLoaded", function () {
    const editListBtn = document.getElementById("editListBtn");
    const blockedWebsitesContainer = document.getElementById("blockedWebsites");
  
    let isEditing = false;
  
    // Handle Edit List button click
    editListBtn.addEventListener("click", function () {
      if (!isEditing) {
        // Clear the container
        blockedWebsitesContainer.innerHTML = "";
  
        // Fetch the list of blocked websites from rules.json
        chrome.runtime.getPackageDirectoryEntry(function (root) {
          root.getFile("rules.json", {}, function (fileEntry) {
            fileEntry.file(function (file) {
              const reader = new FileReader();
              reader.onloadend = function () {
                const rules = JSON.parse(reader.result);
                rules.forEach((rule) => {
                  const checkbox = document.createElement("input");
                  checkbox.type = "checkbox";
                  checkbox.id = `website-${rule.id}`;
                  checkbox.name = "blockedWebsite";
                  checkbox.value = rule.condition.urlFilter;
                  checkbox.checked = true; // Checked by default
                  const label = document.createElement("label");
                  label.htmlFor = `website-${rule.id}`;
                  label.textContent = rule.condition.urlFilter;
                  blockedWebsitesContainer.appendChild(checkbox);
                  blockedWebsitesContainer.appendChild(label);
                });
              };
              reader.readAsText(file);
            });
          });
        });
  
        editListBtn.textContent = "Save";
        isEditing = true;
      } else {
        // Handle saving the edited list
        const checkedWebsites = Array.from(
            document.querySelectorAll("input[name=blockedWebsite]:checked")
        ).map((checkbox) => checkbox.value);
        
        // Hide the list
        blockedWebsitesContainer.innerHTML = "";
  
        editListBtn.textContent = "Edit List";
        isEditing = false;

        // Store the updated list in Chrome storage
        chrome.storage.local.set({ blockedWebsites: JSON.stringify(checkedWebsites) }, function () {
          console.log("Updated list saved successfully.");
  
          // Reload the extension to apply the changes
        //   chrome.runtime.sendMessage({ action: "reloadExtension" });
        });
  
      }
    });
  });
  