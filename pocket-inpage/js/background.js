require(['js/pocket.api'], function (PocketApi) {

    var pocket = new PocketApi();

    function onActionClick(tab) {
        pocket.authorize().done(function(){
            console.log('ok')
        });

/*        pocket.isAdded(tab.url)
            .then(function (isAdded) {
                var deffer = isAdded ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return isAdded;
                });
            })
            .done(function (isAdded) {
                showIcon(tab.id, !isAdded)
            });
  */  }


    function onTabUpdate(tabId, changeInfo, tab) {
        chrome.pageAction.show(tabId);
        pocket.isAdded(tab.url)
            .done(function (isAdded) {
                showIcon(tabId, isAdded);
            });
    }

    function showIcon(tabId, isAdded) {
        var addedIcon = {"19": "images/red-19.png"};
        var notAddedIcon = {"19": "images/black-19.png"};
        chrome.pageAction.setIcon({
            tabId: tabId,
            path: isAdded ? addedIcon : notAddedIcon
        });
    }


    chrome.tabs.onUpdated.addListener(onTabUpdate);
    chrome.pageAction.onClicked.addListener(onActionClick);
});