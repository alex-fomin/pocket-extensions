define(['jquery'], function ($) {
    var outerExtensionId = 'jcnjndaenjdkoilfcanhgpiafkclalml';
    return {
        isAdded: function (url) {
            var d = new $.Deferred();
            chrome.runtime.sendMessage(outerExtensionId, {isAdded: url},
                function (response) {
                    d.resolve(response.isAdded);
                });
            return d.promise();
        },
        add: function (url) {
            var d = new $.Deferred();
            chrome.runtime.sendMessage(outerExtensionId, {add: url},
                function () {
                    d.resolve(true);
                });
            return d.promise();
        },
        remove: function (url) {
            var d = new $.Deferred();
            chrome.runtime.sendMessage(outerExtensionId, {remove: url},
                function () {
                    d.resolve(true);
                });
            return d.promise();
        }
    }
});