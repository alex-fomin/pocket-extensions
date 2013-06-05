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
        }
    }
});