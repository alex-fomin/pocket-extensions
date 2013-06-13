require(['js/communicate'], function (pocket) {

    var addedIcon = {"19": "images/added-19.png"};
    var notAddedIcon = {"19": "images/notAdded-19.png"};
    var unknownIcon = {"19": "images/unknown-19.png"};

    function showPocketStatus(tab, added) {
        chrome.pageAction.setIcon({
            tabId : tab.id,
            path  : added ? addedIcon : notAddedIcon
        });

        chrome.pageAction.setTitle({
            tabId : tab.id,
            title : added ? 'Remove from Pocket' : 'Add to Pocket'
        });
    }

    function startRotating(){

        var images = [
            'images/loader1-19.png',
            'images/loader2-19.png',
            'images/loader3-19.png',
            'images/loader4-19.png'
        ];

        function rotate(){

        }
    }



    function onActionClick(tab) {
        chrome.pageAction.setIcon({
            tabId : tab.id,
            path  : {'19' : 'images/loader-19.gif'}
        });
        pocket.find(tab.url)
            .then(function (item) {
                var deffer = item ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return !!item;
                });
            })
            .done(function (wasAdded) {
                showPocketStatus(tab, !wasAdded);
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
                    showPocketStatus(tab, item);
                })
                .fail(function(item){
                    chrome.pageAction.setIcon({
                        tabId : tabId,
                        path  : unknownIcon
                    });
                })
            ;
        }
    }


    chrome.tabs.onUpdated.addListener(onTabUpdate);
    chrome.pageAction.onClicked.addListener(onActionClick);
});