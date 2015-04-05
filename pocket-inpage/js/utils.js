define(function(require) {
  
    var _ = require('underscore');
  
    var image = function(name){
      return {
        19: 'images/'+name+'-19.png',
        38: 'images/'+name+'-38.png'
      };
    };
  
  
    var addedData = image('added');
    var notAddedData = image('notAdded');
    var rotating = 0;

    var images = [];

    for(var i=1;i<=8;i++){
      images.push(image('loader/'+i));
    }

    return {
      showPocketStatus: function(tabId, added) {
          chrome.pageAction.setIcon({
              tabId : tabId,
              path  : added ? addedData : notAddedData
          });

          chrome.pageAction.setTitle({
              tabId : tabId,
              title : added ? 'Remove from Pocket' : 'Add to Pocket'
          });
      },


      startRotating: function(tabId) {
        var current = 0;

        rotating = setInterval(function(){
          chrome.pageAction.setIcon({tabId : tabId, path : images[current]});
          current = (current + 1) % images.length;
        }, 150);
      },

      stopRotating:function() {
        if (rotating) {
          clearInterval(rotating);
        }
      }
    };
});