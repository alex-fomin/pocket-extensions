define(['jquery', 'underscore'], function ($, _) {
    return {
        resolve: function (obj) {
            var d = new $.Deferred();
            d.resolve(obj);
            return d.promise();
        },


        makeCall: function (path, data) {
            var dataToSend = $.extend({
                consumer_key: '14994-663a5a1f0d49d5816aa7a5bb',
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
});