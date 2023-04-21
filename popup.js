document.addEventListener('DOMContentLoaded', () => {
    const extensionSwitch = document.getElementById('extensionSwitch');
  
    // Restore the saved state from storage
    chrome.storage.local.get('isEnabled', (data) => {
      extensionSwitch.checked = data.isEnabled ?? true;
    });
  
    // Listen for switch changes
    extensionSwitch.addEventListener('change', () => {
      const isEnabled = extensionSwitch.checked;
      chrome.storage.local.set({ isEnabled: isEnabled });
  
      // Send message to content script with the updated state
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { isEnabled: isEnabled });
      });
    });
  });
  