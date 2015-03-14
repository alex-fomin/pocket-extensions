define([], function() {
  
  
    var addedIcon = "images/added-18.png";
    var notAddedIcon = "images/notAdded-18.png";
    var unknownIcon = "images/unknown-18.png";
    var rotating = false;

    var images = [
      'images/loader/1.png',
      'images/loader/2.png',
      'images/loader/3.png',
      'images/loader/4.png',
      'images/loader/5.png',
      'images/loader/6.png',
      'images/loader/7.png',
      'images/loader/8.png'
    ];

    return {
      showPocketStatus: function(tab, added) {
          chrome.pageAction.setIcon({
              tabId : tab.id,
              path  : added ? addedIcon : notAddedIcon
          });

          chrome.pageAction.setTitle({
              tabId : tab.id,
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
    }
});