require(['underscore', 'js/pocket.list'], function (_, pocketList) {

    function updateIcon() {
        if (pocketList.isAuthenticated()) {
            pocketList.getCount()
                .then(function (count) {
                    chrome.browserAction.setBadgeText({
                        text: count.toString()
                    })
                });
        }
        else {
            chrome.browserAction.setBadgeText({
                text: '?'
            });
        }

    }

    /*        items.done(function (list) {
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


     d*/

    chrome.browserAction.onClicked.addListener(function () {
        var d = pocketList.isAuthenticated()
            ? $.Deferred().resolve()
            : pocketList.authorize().then(function () {
                return pocketList.update();
              });

        d
            .then(function () {
                return pocketList.getItems();
            })
            .done(function (items) {
                if (items.length) {
                    var item = items[_.random(items.length - 1)];
                    chrome.tabs.getSelected(null, function (tab) {
                        chrome.tabs.update(tab.id, {url: item.resolved_url});
                    });
                }
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
                .done(updateIcon);

            return true;
        });

    var update = function () {
        pocketList.update()
            .then(updateIcon)
            .done(function () {
                debugger;
                setTimeout(update, 5000 * 60);
            })
    };
    updateIcon();
    update();
})
;