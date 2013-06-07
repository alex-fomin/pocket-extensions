define([
    'jquery'
    , 'underscore'
    , 'js/storage'
    , 'js/pocket.api'
], function ($, _, storage, pocketApi) {
    return {
        getItems: function () {
            var since = storage.getSince() || 0;

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
        },

        isAdded: function (url) {
            return this.getItems()
                .then(function (items) {
                    return _.any(items, function (item) {
                        return item.resolved_url == url || item.given_url == url
                    });
                });
        },

        add: function (url) {
            return pocketApi
                .add({
                    url: url
                })
                .then(function (item) {
                    return storage.add(item)
                });
        }
    };
});
