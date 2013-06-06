require(['underscore', 'js/pocket.list'], function (_, pocketList) {
    chrome.browserAction.onClicked.addListener(function () {
        pocketList.getItems()
            .done(function (items) {
                var list = _.values(items.list);
                var item = list[_.random(list.length - 1)];
                chrome.tabs.getSelected(null, function (tab) {
                    chrome.tabs.update(tab.id, {url: item.resolved_url});
                });
            });
    });

    chrome.runtime.onMessageExternal.addListener(
        function (request, sender, sendResponse) {
            if (request.isAdded) {
                pocketList.isAdded(request.isAdded)
                    .done(function (result) {
                        sendResponse({isAdded: result})
                    });
            } else if (request.remove) {
                pocketList.remove(request.remove)
            }
            else if (request.add) {
                pocketList.add(request.add)
            }
        });

});