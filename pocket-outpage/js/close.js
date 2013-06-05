chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.remove(tab.id);
});
