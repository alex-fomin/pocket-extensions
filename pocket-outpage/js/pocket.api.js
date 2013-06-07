define([
    'jquery'
    , 'underscore'
    , 'js/pocket.api.authentication'
    , 'js/utils'
], function ($, _, authentication, utils) {


    return {
        authentication: authentication,
        getItems: function (config) {
            return utils.makeCall('get', config);
        },
        add: function (config) {
            return utils.makeCall('add', config);
        }
    };
});