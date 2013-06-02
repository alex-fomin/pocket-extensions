var PocketApi = function () {
//    var consumerKey = '14994-663a5a1f0d49d5816aa7a5bb';
    if (!indexedDB['urls'])
        indexedDB['urls'] = [];
    return {

        isAdded: function (url) {
            var defer = new $.Deferred();
            defer.resolve(indexedDB['urls'].indexOf(url) >= 0);
            return defer.promise();
        },

        add: function (url, tags) {
            indexedDB['urls'].push(url);
            var deffer = new $.Deferred();
            deffer.resolve({url:url});
            return deffer.promise();
        },

        remove: function (url) {
            var index = indexedDB['urls'].indexOf(url);
            if (index >= 0)
                indexedDB['urls'].splice(index,1);
            var deffer = new $.Deferred();
            deffer.resolve();
            return deffer.promise();
        }





        /*      add: function (url, tags) {
         return $.ajax({
         url: 'https://getpocket.com/v3/add',
         type: 'POST',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         beforeSend: function (request) {
         request.setRequestHeader('X-Accept', 'application/json');
         },
         data: JSON.stringify({
         url: encodeURIComponent(url),
         tags: tags,
         consumer_key: consumerKey,
         access_token: 'tst'
         })
         });
         },
         */
    }

};