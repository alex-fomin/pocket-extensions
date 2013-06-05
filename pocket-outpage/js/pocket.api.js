define([
    'jquery'
    , 'underscore'
    , 'js/pocket.api.authentication'
    , 'js/utils'
], function ($, _, authentication, utils) {


    return function () {
        this.authentication = authentication;
        this.getItems = function (config) {
            return utils.makeCall('get', config);
        }
    };
});