define(['jquery', 'underscore'], function ($, _) {
    return function (pocketApi, storage) {
        this.getItems = function () {
            var since = storage.getSince()

            var delta = new Date().getTime() / 1000 - since;

            if (delta > 3600000) { // one hour

                var d = pocketApi.getItems({
                    since: since,
                    detailType: 'simple'
                });

                d.fail(function (fail) {
                    if (fail.status == 401) {
                        d = pocketApi.authentication.authorize()
                            .then(function () {
                                return pocketApi.getItems({
                                    since: since,
                                    detailType: 'simple'
                                })
                            });
                    }
                });


                return d.then(function (items) {
                    return storage.update(items);
                })
            }
            else {
                return storage.getItems()
            }
        };

        this.isAdded = function (url) {
            return storage.getItems()
                .then(function (items) {
                   return _.any(items.list, function(item){
                       return item.resolved_url == url || item.given_url == url
                   });
                });
        }
    };
});
