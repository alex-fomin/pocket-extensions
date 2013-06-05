define([
    'jquery'
    , 'underscore'
    , 'js/utils'
], function ($, _, utils) {
    return {
        redirectUri: chrome.extension.getURL('html/redirect.html'),

        isAuthorized: function () {
            return localStorage['access_token'];
        },

        saveAccessToken: function (obj) {
            localStorage['access_token'] = obj.access_token;
        },

        authorize: function () {
            if (this.isAuthorized()) {
                return utils.resolve(true);
            } else {
                return this.obtainRequestToken()
                    .then(_.bind(this.openLoginPage, this))
                    .then(_.bind(this.authorizeApp, this))
                    .then(_.bind(this.saveAccessToken, this));
            }
        },

        openLoginPage: function (token) {
            var d = new $.Deferred();
            chrome.windows.create({
                url: 'https://getpocket.com/auth/authorize?request_token=' + token.code + '&redirect_uri=' + this.redirectUri,
                type: 'popup'
            }, function (win) {

                var closeListener = function (windowId) {
                    if (win.id == windowId) {
                        chrome.windows.onRemoved.removeListener(closeListener);
                        d.resolve(token.code);
                    }
                };

                chrome.windows.onRemoved.addListener(closeListener);
            });
            return d.promise();
        },

        authorizeApp: function (code) {
            return utils.makeCall('oauth/authorize', {code: code});
        },

        obtainRequestToken: function () {
            return utils.makeCall('oauth/request', { redirect_uri: this.redirectUri });
        }
    };
});