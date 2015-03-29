define(['jquery'], function ($) {
    return {
        resolve: function (obj) {
            return $.Deferred().resolve(obj);
        },

        reject: function (obj) {
            return $.Deferred().reject(obj);
        },


        wrap: function (req) {
            var d = $.Deferred();
            req.onsuccess = function () {
                d.resolve();
            };
            req.onerror = function () {
                d.reject();
            };
            return d;
        },


        makeCall: function (path, data) {
            var dataToSend = $.extend({
                consumer_key: '15287-db68741601b94e375145742f',
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
    };
});