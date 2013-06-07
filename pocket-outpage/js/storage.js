define(['jquery', 'underscore'], function ($, _) {


        return {
            openStore: function () {
                if (!this.db) {
                    var request = window.indexedDB.open("pocket", 4);
                    this.db = new $.Deferred();
                    request.onsuccess = _.bind(function (evt) {
                        this.db.resolve(evt.target.result)
                    }, this);
                    request.onerror = _.bind(function () {
                        this.db.reject(this.error);
                    }, this);
                    request.onupgradeneeded = function (event) {
                        var database = event.target.result;
                        var store = database.createObjectStore("articles", { keyPath: "item_id" });
                        store.createIndex("resolved_url", "resolved_url", { unique: true });
                        store.createIndex("stored_url", "stored_url", { unique: true });
                    };
                }
                return this.db.then(function (base) {
                    var transaction = base.transaction(["articles"], "readwrite");
                    return transaction.objectStore("articles");
                });
            },


            getSince: function () {
                return parseInt(localStorage.getItem('since') || '0', 10);
            },

            updateItems: function (items) {
                return this.openStore()
                    .then(function (store) {
                        _.each(items, function (item) {
                            if (item.status && item.status != "0") {
                                store.delete(item.item_id);
                            }
                            else {
                                store.put(item);
                            }
                        });
                    })
                    .done(_.bind(function () {
                        return this.getItems();
                    }, this));
            },

            update: function (items) {
                localStorage.setItem('since', items.since);
                return this.updateItems(items.list);
            },

            add: function (item) {
                return this.updateItems([item.item]);
            },


            getItems: function () {
                return this.openStore()
                    .then(function (store) {
                        var items = [];
                        var d = new $.Deferred();
                        store.openCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                items.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                d.resolve(items);
                            }
                        };
                        return d.promise();
                    });
            }
        };
    }
)
;