require(['js/communicate', 'js/urlMode', 'js/utils'], function (pocket, urlMode, utils) {
    
    var currentMode=urlMode;

    function onActionClick(tab) {
      currentMode.onActionClick(tab);
    }


    function onTabUpdate(tabId, changeInfo, tab) {
      currentMode.onTabUpdate(tabId, changeInfo, tab);
    }


    chrome.tabs.onUpdated.addListener(onTabUpdate);
    chrome.pageAction.onClicked.addListener(onActionClick);

    function add(tab, url) {
        utils.startRotating(tab.id);
        pocket.add(url)
            .then(stopRotating, stopRotating);
    }

    var menuId = chrome.contextMenus.create({
        type                : 'normal',
        title               : 'Add to Pocket',
        contexts            : ["page", "frame", "link"],
        documentUrlPatterns : ["http://*/*", "https://*/*"],
        targetUrlPatterns   : ["http://*/*", "https://*/*"],
        onclick             : function (info, tab) {
            add(tab, info.linkUrl || info.pageUrl);
        }
    });
});