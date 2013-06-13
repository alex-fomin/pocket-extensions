require(['js/communicate'], function (pocket) {

    var addedIcon = {"19" : "images/added-19.png"};
    var notAddedIcon = {"19" : "images/notAdded-19.png"};
    var unknownIcon = {"19" : "images/unknown-19.png"};

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

    var rotating = true;
    function startRotating(tabId) {

        var images = [
            'images/loader1-19.png',
            'images/loader2-19.png',
            'images/loader3-19.png',
            'images/loader4-19.png',
            'images/loader5-19.png',
            'images/loader6-19.png',
            'images/loader7-19.png',
            'images/loader8-19.png'
        ];

        var current = 0;

        rotating = true;
        function rotate() {
            if (rotating) {
                chrome.pageAction.setIcon({tabId : tabId, path : images[current]});
                current = (current + 1) % images.length;
                setTimeout(rotate, 300);
            }
        }

        rotate();
    }

    function stopRotating(){
        rotating = false;
    }


    function onActionClick(tab) {
        startRotating(tab.id);
        pocket.find(tab.url)
            .then(function (item) {
                var deffer = item ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return !!item;
                });
            })
            .done(function (wasAdded) {
                stopRotating();
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
                .fail(function (item) {
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