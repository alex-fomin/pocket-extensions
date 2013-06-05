define(['jquery', 'underscore', 'js/utils'], function ($, _, utils) {
    return function(){
        this.getSince = function(){
            return (window.items && localStorage.getItem('since')) || 0;
        };
        this.update = function(items){
            localStorage.setItem('since',items.since);
            window.items = items;
            return utils.resolve(items);
        };
        this.getItems = function(){
            return utils.resolve(window.items);
        };
    };
});