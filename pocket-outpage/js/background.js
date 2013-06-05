require(['underscore', 'js/container'], function (_, container) {
    chrome.browserAction.onClicked.addListener(function () {
        container.pocketList.getItems()
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
                container.pocketList.isAdded(request.isAdded)
                    .done(function (result) {
                        sendResponse({isAdded: result})
                    });
            } else if (request.remove){
                container.pocketList.remove(request.remove)
            }
        });

});