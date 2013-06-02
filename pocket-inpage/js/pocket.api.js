define(['jquery', 'underscore'], function ($, _) {
    var resolve = function (obj) {
        var d = new $.Deferred();
        d.resolve(obj);
        return d.promise();
    };
    var redirectUri = chrome.extension.getURL('html/redirect.html');

    var PocketApi = function () {

        return {
            saveAccessToken: function (obj) {
                localStorage['access_token'] = obj.access_token;
            },

            isAuthorized: function () {
                return localStorage['access_token'];
            },


            authorize: function () {
                if (this.isAuthorized()) {
                    return resolve(true);
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
                    url: 'https://getpocket.com/auth/authorize?request_token=' + token.code + '&redirect_uri=' + redirectUri,
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
                return this.makeCall('oauth/authorize', {code: code});
            },

            obtainRequestToken: function () {
                return this.makeCall('oauth/request', {
                    redirect_uri: redirectUri
                });
            },

            isAdded: function (url) {
                if (this.isAuthorized() && url.indexOf('chrome://')!=0 && url.indexOf('http://http://getpocket.com/a/')!=0) {
                    return this.makeCall('get',
                        {
                            state: 'unread',
                            detailType: 'simple',
                            search: url
                        }
                    ).pipe(function (result) {
                            return resolve(_.find(result.list,
                                function (item) {
                                    return item.resolved_url == url;
                                }));
                        });
                }
                else {
                    return resolve(false);
                }
            },

            add: function (url, tags) {
                return resolve(false);
            },

            remove: function (url) {
                return resolve(false);
            },

            makeCall: function (path, data) {
                var dataToSend = $.extend({
                    consumer_key: PocketApi.consumerKey,
                    access_token: localStorage['access_token']
                }, data);

                return $.ajax({
                    url: 'https://getpocket.com/v3/' + path,
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function (request) {
                        request.setRequestHeader('X-Accept', 'application/json');
                    },
                    data: JSON.stringify(dataToSend)
                });
            }
        }
    };

    PocketApi.consumerKey = '14994-663a5a1f0d49d5816aa7a5bb';
    return PocketApi;
});