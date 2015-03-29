define(function(require){
    var $ = require('jquery'),
        storage = require('js/storage'),
        pocketApi = require('js/pocket.api');

    return {

        isAuthenticated: function () {
            return !!localStorage['access_token'];
        },

        update: function (since) {
            if (this.isAuthenticated()) {
                since = since || storage.getSince() || 0;
                return pocketApi
                    .getItems({
                        since: since,
                        detailType: 'simple'
                    })
                    .then(function (items) {
                        return storage.update(items, since);
                    });
            }
            else {
                return $.Deferred().reject('Not authenticated');
            }
        },

        getItems: function () {
            return storage.getItems();
        },


        find: function (url) {
            return storage.find(url);
        },

        add: function (url) {
            if (this.isAuthenticated()) {
                return pocketApi
                    .add({ url: url })
                    .then(function (item) {
                        return storage.add(item);
                    });
            } else {
                return $.Deferred().reject('Not authenticated');
            }
        },

        remove: function (url) {
            if (this.isAuthenticated()) {
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
                            });
                    })
                    .then(function (id) {
                        return storage.remove(id);
                    });
            } else {
                return $.Deferred().reject('Not authenticated');
            }
        },

        getCount: function () {
            return this.getItems().then(function (items) {
                return items.length;
            });
        }
    };
});
