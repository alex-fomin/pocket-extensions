define(['jquery', 'underscore', 'js/utils'], function ($, _, utils) {

    var db = utils.db(window.indexedDB.open("pocket", 1, function (event) {
        var database = event.target.result;
        var store = database.createObjectStore("articles", { keyPath: "id" });
        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        store.createIndex("resolved_url", "resolved_url", { unique: true });
        store.createIndex("stored_url", "stored_url", { unique: true });
    }));


    return {
        getSince: function () {
            return parseInt(localStorage.getItem('since') || '0', 10);
        },
        update: function (items) {
            localStorage.setItem('since', items.since);

            db
                .then(function (base) {
                    var transaction = base.transaction(["articles"], "readwrite");
                    var store = transaction.objectStore("articles");
                    _.each(items.list, function(item){
                       store.put(item);
                    });
                });


            this.items = items;
            return utils.resolve(items);
        },
        getItems: function () {
            return utils.resolve(this.items.list);
        }
    };
});