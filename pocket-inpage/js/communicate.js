define(['underscore'], function(_){
    var outerExtensionId = new Promise(function(resolve, reject){
        chrome.management.getAll(function(extensions) {
            var info = _.find(extensions, function(info) {
                return info.name == 'Pocket outpage';
            });
        
            if (info) {
                resolve(info.id);
            }
            else {
                reject('Could not find outpage extension');
            }
        });
    });


    function sendMessage(config){
        return outerExtensionId.then(function(outerExtId){
            return new Promise(function(resolve,reject){
            chrome.runtime.sendMessage(outerExtId, config,
                function(response){
                    if (!_.isUndefined(response.success)){
                        resolve(response.success);
                    }
                    else {
                        reject(response.fail || 'fail');
                    }
                });
            });
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
    };
});