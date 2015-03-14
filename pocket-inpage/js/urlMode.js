define(['js/communicate', 'js/utils'], function (pocket, utils) {
  return {
      onActionClick:function(tab) {
        var url = tab.url;

        utils.startRotating(tab.id);
        pocket.find(url)
            .then(function (item) {
                var deffer = item ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return !!item;
                });
            })
            .then(function (wasAdded) {
                utils.showPocketStatus(tab, !wasAdded);
                utils.stopRotating();
            }, function(){
                utils.stopRotating();
            });
      },
      onTabUpdate:function(tabId, changeInfo, tab){
        if (tab.url.indexOf('chrome://') === 0) {
            chrome.pageAction.hide(tabId);
        }
        else {

            chrome.pageAction.show(tabId);
            pocket.find(tab.url)
                .then(function (item) {
                    utils.showPocketStatus(tab, item);
                }, function (item) {
                    chrome.pageAction.setIcon({
                        tabId : tabId,
                        path  : unknownIcon
                    });
                })
            ;
        }
      }
    };
});
