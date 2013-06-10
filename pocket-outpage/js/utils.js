define(['jquery'], function($){
    return {
        resolve: function(obj){
            var d = new $.Deferred();
            d.resolve(obj);
            return d.promise();
        },

        reject: function(obj){
            var d = new $.Deferred();
            d.reject(obj);
            return d.promise();
        },


        makeCall: function(path, data){
            var dataToSend = $.extend({
                consumer_key: '15287-db68741601b94e375145742f',
                access_token: localStorage['access_token']
            }, data);

            return $.ajax({
                url: 'https://getpocket.com/v3/' + path,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                beforeSend: function(request){
                    request.setRequestHeader('X-Accept', 'application/json');
                },
                data: JSON.stringify(dataToSend)
            });
        }
/*                .fail(function(fail){
 if (fail.status == 401) {
 d = pocketApi.authentication.authorize()
 .then(function(){
 return pocketApi.getItems({
 since: since,
 detailType: 'simple'
 })
 });
 }
 });*/
    }
});