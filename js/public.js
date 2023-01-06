await getConfig();
function readCookie(key) {
    var prefix = key + "="
    var start = document.cookie.indexOf(prefix)
    if (start == -1) {
        return null;
    }
    var end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
    var value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
}
function writeCookie(key, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = key + "=" + value  + ";expires=" + exp.toGMTString();
}
function getConfig() {
    var request = new XMLHttpRequest();
    request.open("get", "config.json");
    request.send(null);
    request.onload = function () {
        if (request.status == 200) {
            var data = JSON.parse(request.responseText);
            window.config = data;
        }
    };
    return window.config;
}
