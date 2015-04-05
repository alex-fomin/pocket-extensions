require(['js/communicate', 'js/utils'], function(pocket, utils) {

    chrome.pageAction.onClicked.addListener(function(tab) {
        var url = map[tab.id] || tab.url;
        if (map[tab.id]) {
            delete map[tab.id];
        }
        utils.startRotating(tab.id);

        pocket.find(url)
        .then(function(item) {
            var deffer = item ? pocket.remove(url) : pocket.add(url);
            return deffer.then(function() {
                return !!item;
            });
        }, utils.stopRotating)
        .then(function(wasAdded) {
            utils.stopRotating();
            utils.showPocketStatus(tab.id, !wasAdded);
        }, utils.stopRotating);
    }
    );

    var menuId = chrome.contextMenus.create({
        type: 'normal',
        title: 'Add to Pocket',
        contexts: ["page", "frame", "link"],
        documentUrlPatterns: ["http://*/*", "https://*/*"],
        targetUrlPatterns: ["http://*/*", "https://*/*"],
        onclick: function(info, tab) {
            utils.startRotating(tab.id);

            pocket.add(info.linkUrl || info.pageUrl)
            .then(stopRotating);
        }
    });

    var find = function(url){
      return url ? pocket.find(url) : new Promise(function(resolve) {
              resolve(false);
            });
    };

    var map = {};

    var update = function(tabId, urlBefore, urlAfter) {
        utils.stopRotating();
        chrome.tabs.get(tabId, function(tab){
          var statusBefore;
          var statusAfter;
          if (!tab) {
            statusBefore = new Promise(function(resolve){resolve(false);});
            statusAfter = statusBefore;
          }
          else {
            chrome.pageAction.show(tabId);
            statusBefore = find(urlBefore);
            statusAfter = find(urlAfter);
          }
          Promise.all([statusBefore, statusAfter])
          .then(function(result) {
              var hasBefore = result[0];
              var hasAfter = result[1];
              utils.showPocketStatus(tabId, hasBefore || hasAfter);
              map[tabId] = hasBefore ? urlBefore : urlAfter;
          });
        });
    };


    chrome.webNavigation.onBeforeNavigate.addListener(function(a) {
        if (a.frameId === 0) {
            map[a.tabId] = a.url;
            update(a.tabId, a.url);
        }
    });

    var afterUpdate = function(a){
        if (a.frameId === 0) {
            var urlBefore = map[a.tabId];
            var urlAfter = a.url;

            update(a.tabId, urlBefore, urlAfter);
        }
    };


    chrome.webNavigation.onCommitted.addListener(afterUpdate);
    chrome.webNavigation.onDOMContentLoaded.addListener(afterUpdate);
    chrome.webNavigation.onCompleted.addListener(afterUpdate);

});
