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

    chrome.browserAction.onClicked.addListener(function (arg) {
      var tabId = arg.id;
      authentication.authorize()
        .then(update)
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
            if (method && pocketList[method]) {
              pocketList[method](request[method])
                  .done(function (result) {
                      sendResponse({success: result || null});
                  })
                  .fail(function (result) {
                      sendResponse({fail: result});
                  })
                  .done(updateIcon);
            }
            else {
              sendResponse({fail:'No such method'});
            }

            return true;
        });


    var update = function(){
      return pocketList.update().then(updateIcon);
    };

    update().then(function(){
      setInterval(update, 5000*60);
    });
});