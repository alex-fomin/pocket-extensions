require(['js/communicate'], function (pocket) {

    var addedIcon = "images/added-18.png";
    var notAddedIcon = "images/notAdded-18.png";
    var unknownIcon = "images/unknown-18.png";

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
            'images/loader/1.png',
            'images/loader/2.png',
            'images/loader/3.png',
            'images/loader/4.png',
            'images/loader/5.png',
            'images/loader/6.png',
            'images/loader/7.png',
            'images/loader/8.png'
        ];

        var current = 0;

        rotating = true;
        function rotate() {
            if (rotating) {
                chrome.pageAction.setIcon({tabId : tabId, path : images[current]});
                current = (current + 1) % images.length;
                setTimeout(rotate, 150);
            }
        }

        rotate();
    }

    function stopRotating() {
        rotating = false;
    }


    function onActionClick(tab) {
        var url = tab.url;

        startRotating(tab.id);
        pocket.find(url)
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

    function add(tab, url) {
        startRotating(tab.id);
        pocket.add(url)
            .done(function () {
                stopRotating();
                showPocketStatus(tab, true);
            });
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