define([
    'jquery'
    , 'underscore'
    , 'js/storage'
    , 'js/pocket.api'
    , 'js/utils'
], function ($, _, storage, pocketApi, utils) {
    return {

        _ensure: function () {
            var since = storage.getSince() || 0;
            var delta = new Date().getTime() / 1000 - since;

            if (delta > 3600000) { // one hour
                return this._update(since);
            }
            else {
                return utils.resolve();
            }
        },


        _update: function (since) {
            return pocketApi
                .getItems({
                    since: since,
                    detailType: 'simple'
                })
                .then(
                function (items) {
                    return storage.update(items);
                });
        },


        authorize: function () {
            return pocketApi.authentication.authorize();
        },


        getItems: function () {
            return this._ensure().then(function (items) {
                if (items)
                    return items;
                else
                    return storage.getItems();
            });
        },


        find: function (url) {
            return this._ensure()
                .then(function () {
                    return storage.find(url);
                });
        },

        add: function (url) {
            return pocketApi
                .add({ url: url })
                .then(function (item) {
                    return storage.add(item)
                });
        },

        remove: function (url) {
            return storage
                .find(url)
                .then(function (item) {
                    return pocketApi.modify({
                        actions: [
                            { item_id: item.item_id, action: 'archive' }
                        ]
                    })
                        .then(function () {
                            return item.item_id;
                        })
                })
                .then(function (id) {
                    return storage.remove(id)
                });
        },

        getCount: function () {
            return this._ensure()
                .then(_.bind(function () {
                    return this.getItems();
                }, this))
                .then(function (items) {
                    return items.length;
                });
        }
    };
});
