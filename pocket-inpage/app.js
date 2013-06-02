requirejs.config({
    "baseUrl": "libs",
    "paths": {
        "js": "../js"
    }
});

requirejs(["js/background"]);