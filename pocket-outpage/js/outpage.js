require(['underscore', 'js/pocket.list'], function (_, pocketList) {
    function showUnreadBadge() {
        pocketList.getCount()
            .then(function (count) {
                chrome.browserAction.setBadgeText({
                    text: count.toString()
                })
            });
    }


    chrome.browserAction.onClicked.addListener(function () {
        var d = new $.Deferred();

        var items = pocketList.getItems();
        items.done(function (list) {
            d.resolve(list);
        });
        items.fail(function (fail) {
            if (fail.status == 401) {
                pocketList.authorize()
                    .then(function () {
                        pocketList.getItems().done(function (list) {
                            d.resolve(list);
                        });
                    });
            }
            else {
                d.reject(fail);
            }
        });


        d.done(function (items) {
            var item = items[_.random(items.length - 1)];
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.update(tab.id, {url: item.resolved_url});
            });
        });
    });


    chrome.runtime.onMessageExternal.addListener(
        function (request, sender, sendResponse) {
            var method = _.keys(request)[0];
            pocketList[method](request[method])
                .done(function (result) {
                    sendResponse({success: result || null})
                })
                .fail(function (result) {
                    sendResponse({fail: result})
                })
                .done(showUnreadBadge);

            return true;
        });
    showUnreadBadge();
});