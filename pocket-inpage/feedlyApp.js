requirejs.config({
    "baseUrl": chrome.extension.getURL("/libs/"),
    "paths": {
        "js": "../js"
    },
    shim: {
        underscore: {
            exports: '_'
        }
}});
requirejs(['jquery','js/communicate'], function ($, pocket){
    console.log('test');
    $('body').on('click', '.quicklistHandle', function(){
        console.log($(this).parent().find('a[target="_blank"]').attr('href'));
    });

});
//<img src="http://s3.feedly.com/production/16.0/images/pixel.png" data-toggleentryid="vbz3oVbAYyTLIA+INfqzE1CAnDv59sDziMPIFxCyFNw=_13f539a2cc0:b8dd39:918c381f" data-toggle="quicklisted" class="wikiWidgetAction highlightableIcon wikiWidgetSave" data-entryid="vbz3oVbAYyTLIA+INfqzE1CAnDv59sDziMPIFxCyFNw=_13f539a2cc0:b8dd39:918c381f" title=" save for later" border="0" width="20" height="20" align="top">
//<div                                                             data-toggleentryid="vbz3oVbAYyTLIA+INfqzE1CAnDv59sDziMPIFxCyFNw=_13f539a2cc0:b8dd38:918c381f" data-toggle="quicklisted" class="quicklistHandle"></div>

//<a id="fD4IzFfUxklLNJihyiRj2AxlKEIlff+il6HkRW86SSA=_13f5395707d:bb0284:a7cd00_main_title"
// href="http://blog.arbuz.uz/2013/06/18/paradoks-dokazatelstva-perevod/"
// target="_blank" class="title unread"
// data-inlineentryid="fD4IzFfUxklLNJihyiRj2AxlKEIlff+il6HkRW86SSA=_13f5395707d:bb0284:a7cd00"
// data-navigation="inline">Парадокс доказательства</a>