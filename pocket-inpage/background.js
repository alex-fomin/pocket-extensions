var urls=[];

function isAlreadyAdded(tab) {
    return _.contains(urls,tab.url);
}

function showIcon(tab, tabId, icons) {
    chrome.pageAction.setIcon({
        tabId:tabId,
        path:icons
    });
}
function onTabUpdate(tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
    if (isAlreadyAdded(tab))
        showIcon(tab, tabId, {"19":"images/red-19.png"});
    else
        showIcon(tab, tabId, {"19":"images/black-19.png"});
}

function remove(tab) {
    var index = urls.indexOf(tab.url);
    if (index>=0)
        urls.splice(index,1);
}
function add(tab) {
    var index = urls.indexOf(tab.url);
    if (index<0)
        urls.push(tab.url);
}
function onActionClick(tab){
    if (isAlreadyAdded(tab))
        remove(tab);
    else
        add(tab);
    onTabUpdate(tab.id, null, tab);
}



// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.pageAction.onClicked.addListener(onActionClick);


/*function(tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    });
});
 */