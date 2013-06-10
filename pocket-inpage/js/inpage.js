require(['js/communicate'], function (pocket) {

    var addedIcon = {"19": "images/added-19.png"};
    var notAddedIcon = {"19": "images/notAdded-19.png"};
    var unknownIcon = {"19": "images/unknown-19.png"};


    function onActionClick(tab) {
        pocket.find(tab.url)
            .then(function (item) {
                var deffer = item ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return !!item;
                });
            })
            .done(function (wasAdded) {
                showIcon(tab.id, wasAdded ? notAddedIcon : addedIcon)
            });
    }


    function onTabUpdate(tabId, changeInfo, tab) {
        if (tab.url.indexOf('chrome://') == 0) {
            chrome.pageAction.hide(tabId);
        }
        else {
            chrome.pageAction.show(tabId);
            pocket.find(tab.url)
                .done(function (item) {
                    showIcon(tabId, item ? addedIcon : notAddedIcon);
                })
                .fail(function(item){
                    showIcon(tabId, unknownIcon)
                })
            ;
        }
    }


    function showIcon(tabId, icon) {
        chrome.pageAction.setIcon({
            tabId: tabId,
            path: icon
        });
    }


    chrome.tabs.onUpdated.addListener(onTabUpdate);
    chrome.pageAction.onClicked.addListener(onActionClick);
});