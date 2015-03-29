define(function(require) {

    var $ = require('jquery'),
        _ = require('underscore'),
        utils = require('js/utils');

    var redirect_uri = chrome.identity.getRedirectURL() + 'oauth';


    return {


        isAuthorized: function() {
            return localStorage['access_token'];
        },

        saveAccessToken: function(obj) {
            localStorage['access_token'] = obj.access_token;
        },

        authorize: function() {
            if (this.isAuthorized()) {
                return utils.resolve(true);
            } else {


                return utils
                    .makeCall('oauth/request', {
                        redirect_uri: redirect_uri
                    })
                    .then(function(obj) {
                        var result = $.Deferred();

                        var url = 'https://getpocket.com/auth/authorize?request_token=' + obj.code +
                            '&redirect_uri=' + redirect_uri;

                        chrome.identity.launchWebAuthFlow({
                            'url': url,
                            'interactive': true
                        }, function(redirect_url) {

                            result.resolve(obj.code);

                        });

                        return result.promise();
                    })
                    .then(function(code) {
                        return utils.makeCall('oauth/authorize', {
                            code: code
                        });
                    })
                    .then(function(obj) {
                        this.saveAccessToken(obj);
                    }.bind(this));

            }
        }
    };
});