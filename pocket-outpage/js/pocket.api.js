define(function(require) {
  
  var utils = require('js/utils');

    return {
        getItems: function (config) {
            return utils.makeCall('get', config);
        },
        add: function (config) {
            return utils.makeCall('add', config);
        },
        modify: function (config) {
            return utils.makeCall('send', config);
        }
    };
});