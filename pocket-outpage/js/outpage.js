require(['underscore', 'js/pocket.list', 'js/pocket.api.authentication', 'js/storage'],
  function(_, pocketList, authentication, storage) {

    function updateIcon() {
      pocketList.getCount()
        .done(function(count){
          chrome.browserAction.setBadgeText({
            text: count.toString()
          });
        })
        .fail(function(){
          chrome.browserAction.setBadgeText({
                text: '?'
            });
        });
    }


    chrome.contextMenus.create({
      title: "Clear",
      contexts: ["browser_action"],
      onclick: function() {
        if (confirm('Clear all?')){
          storage._clear()
            .then(function(){
              delete localStorage['access_token'];
              delete localStorage['since'];
              alert('Done');
              updateIcon();
              update();
            });
        }
      }
    });

    chrome.browserAction.onClicked.addListener(function (arg) {
      var tabId = arg.id;
      var d = pocketList.isAuthenticated()
          ? $.Deferred().resolve()
          : authentication.authorize()
            .then(pocketList.update.bind(pocketList))
            .then(updateIcon);

        d
            .then(pocketList.getItems.bind(pocketList))
            .done(function (items) {
                if (items.length) {
                    var item = items[_.random(items.length - 1)];
                    chrome.tabs.update(tabId, {url: item.resolved_url});
                }
            });
    });


    chrome.runtime.onMessageExternal.addListener(
        function (request, sender, sendResponse) {
            var method = _.keys(request)[0];
            pocketList[method](request[method])
                .done(function (result) {
                    sendResponse({success: result || null});
                })
                .fail(function (result) {
                    sendResponse({fail: result});
                })
                .done(updateIcon);

            return true;
        });

    var update = function () {
        pocketList.update()
            .then(updateIcon)
            .done(function () {
                setTimeout(update, 5000 * 60);
            });
    };
    updateIcon();
    update();
});