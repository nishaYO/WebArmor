document.addEventListener("DOMContentLoaded", function () {
  const editListBtn = document.getElementById("editListBtn");
  const addBtn = document.getElementById("addBtn");
  const addWebsiteInput = document.getElementById("addWebsiteInput");
  const blockedWebsitesContainer = document.getElementById("blockedWebsites");

  let isEditing = false;
  let addedWebsites = []; // Array to store newly added websites

  // Hide the Add button initially
  addBtn.style.display = "none";

  // Handle Edit List button click
  editListBtn.addEventListener("click", function () {
    if (!isEditing) {
      // Clear the container
      blockedWebsitesContainer.innerHTML = "";

      // Fetch the list of blocked websites from local storage
      chrome.storage.local.get("blockedWebsites", function (data) {
        let blockedWebsites = JSON.parse(data.blockedWebsites || "[]");
        displayBlockedWebsites(blockedWebsites);
      });

      editListBtn.textContent = "Save";
      isEditing = true;

      // Show the Add button
      addBtn.style.display = "block";
    } else {
      // Handle saving the edited list
      const checkedWebsites = Array.from(
        document.querySelectorAll("input[name=blockedWebsite]:checked")
      ).map((checkbox) => checkbox.value);

      // Append newly added websites to the list
      checkedWebsites.push(...addedWebsites);

      // Hide the list
      blockedWebsitesContainer.innerHTML = "";

      editListBtn.textContent = "Edit List";
      isEditing = false;

      // Store the updated list in Chrome storage
      chrome.storage.local.set(
        { blockedWebsites: JSON.stringify(checkedWebsites) },
        function () {
          console.log("Updated list saved successfully.");

          // Hide the Add button again
          addBtn.style.display = "none";
        }
      );
    }
  });

  // Function to display blocked websites
  function displayBlockedWebsites(blockedWebsites) {
    blockedWebsites.forEach((website, index) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `website-${index + 1}`;
      checkbox.name = "blockedWebsite";
      checkbox.value = website;
      checkbox.checked = true; // Checked by default
      const label = document.createElement("label");
      label.htmlFor = `website-${index + 1}`;
      label.textContent = website;
      blockedWebsitesContainer.appendChild(checkbox);
      blockedWebsitesContainer.appendChild(label);
    });
  }

  // Handle Add button click
  addBtn.addEventListener("click", function () {
    addWebsiteInput.style.display = "block";
    addWebsiteInput.focus();
  });

  // Handle input Enter key press
  addWebsiteInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const newWebsite = addWebsiteInput.value.trim();
      if (newWebsite !== "") {
        // Format the new website URL
        const formattedWebsite = formatWebsiteURL(newWebsite);
        addedWebsites.push(formattedWebsite); 
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `website-${blockedWebsitesContainer.children.length + 1}`;
        checkbox.name = "blockedWebsite";
        checkbox.value = newWebsite;
        checkbox.checked = true; // Checked by default
        const label = document.createElement("label");
        label.htmlFor = `website-${
          blockedWebsitesContainer.children.length + 1
        }`;
        label.textContent = newWebsite;
        blockedWebsitesContainer.appendChild(checkbox);
        blockedWebsitesContainer.appendChild(label);
        addWebsiteInput.value = "";
        addWebsiteInput.style.display = "none";
      }
    }
  });

  // Function to format the website URL
  function formatWebsiteURL(website) {
    // Add wildcards (*) appropriately
    if (!website.startsWith("*://")) {
      website = "*://" + website;
    }
    if (!website.endsWith("/*")) {
      website += "/*";
    }
    return website;
  }
});
