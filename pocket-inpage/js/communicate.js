define(['underscore', 'jquery'], function(_, $){
    var outerExtensionId = (function(){
        var result = new $.Deferred();
        chrome.management.getAll(function(extensions){
            var info = _.find(extensions, function(info){
                return info.name == 'Pocket outpage'
            });
            if (info) {
                result.resolve(info.id);
            }
            else {
                result.reject('Could not find outpage extension');
            }
        });
        return result.promise();
    })();

    function sendMessage(config){
        return outerExtensionId.then(function(outerExtId){
            var d = new $.Deferred();
            chrome.runtime.sendMessage(outerExtId, config,
                function(response){
                    if (!_.isUndefined(response.success)){
                        d.resolve(response.success);
                    }
                    else {
                        d.reject(response.fail || 'fail');
                    }
                });
            return d.promise();
        });
    }

    return {
        find: function(url){
            return sendMessage({find: url});
        },

        add: function(url){
            return sendMessage({add: url});
        },

        remove: function(url){
            return sendMessage({remove: url});
        }
    }
});