define([
    'jquery'
    , 'underscore'
    , 'js/pocket.api'
    , 'js/pocket.list'
    , 'js/indexedDbStorage'
], function ($, _, PocketApi, PocketList, MyStorage) {
    return {
           pocketList: new PocketList(new PocketApi(), new MyStorage())
    }
});