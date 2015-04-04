define(function(require) {
  
    var _ = require('underscore');
  
    var addedData = {19: "images/added-19.png", 38: "images/added-38.png"};
    var notAddedData = {19: "images/notAdded-19.png", 38: "images/notAdded-38.png"};
    var rotating = false;

    var images =[];
    
    for(var i=1;i<=8;i++){
      images.push({
        19: 'images/loader/'+i+'-19.png',
        38: 'images/loader/'+i+'-38.png'
      });
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

        rotating = true;
        function rotate() {
            if (rotating) {
                chrome.pageAction.setIcon({tabId : tabId, path : images[current]});
                current = (current + 1) % images.length;
                setTimeout(rotate, 150);
            }
        }

        rotate();
      },

      stopRotating:function() {
        rotating = false;
      }
    };
});