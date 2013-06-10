require(['underscore', 'js/pocket.list'], function(_, pocketList){
    chrome.browserAction.onClicked.addListener(function(){
        var items = pocketList.getItems();

            items.fail(function(fail){
                if (fail.status==401){
                    items = pocketList.authorize()
                        .then(_.bind(pocketList.getItems, this));
                }
            });

            items.done(function(items){
                var item = items[_.random(items.length - 1)];
                chrome.tabs.getSelected(null, function(tab){
                    chrome.tabs.update(tab.id, {url: item.resolved_url});
                });
            });
    });

    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse){
            var method = _.keys(request)[0];
            pocketList[method](request[method])
                .done(function(result){
                    sendResponse({success: result||null})
                })
                .fail(function(result){
                    sendResponse({fail: result})
                });

            return true;
        });
});