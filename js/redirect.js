var stop = isTencentAppBrowser();
if (stop == true) {
    throw SyntaxError();
}
var pathname = window.location.pathname;
var filename = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
redirect();
function redirect() {
    var verified = readCookie("verified");
    var logined = readCookie("logined");
    if (verified != "true" && filename != "verify.html"){
        window.location.href = "verify.html";
        throw SyntaxError();
    }
    if (logined != "true" && filename != "login.html") {
        window.location.href = "login.html";
        throw SyntaxError();
    }
    if (verified == "true" && logined == "true" && filename != "main.html" && filename != "main2.html") {
        if (window.config.hideR18 == false) {
            window.location.href = "main.html";
        } else {
            window.location.href = "main2.html";
        }
    }
}
function isTencentAppBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    var app = "";
    if (ua.indexOf("MicroMessenger") != -1) {
        app = "inWeiXin";
    } else if (ua.indexOf("Windows Phone") != -1) {
        app = "WPBrowser";
    } else if (ua.indexOf("QQ") != -1) {
        if (ua.indexOf("_SQ_") != -1) {
            app = "inQQ";
        } else {
            app = "inQQBrowser";
        }
    } else {
        return false;
    }
    pathname = window.location.pathname;
    filename = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
    if (filename != "index.html") {
        window.location.href = "index.html";
        return true;
    }
    var info = document.getElementById("info");
    switch (app) {
        case "inWeiXin":
            info.innerHTML = "<font size='6'><b>提示：<br>请使用非国产软件内置浏览器访问本页面，你可以点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        case "WPBrowser":
            info.innerHTML = "<font size='6'><b>提示：<br>您使用的可能是Windows Phone平台，我们无法判断您的浏览器，请确保您是使用非国产软件内置浏览器访问的本页面后点击<a href='login.html'><button name='WPBrowser' value='true'>继续</button></a>；亦或者，如果您使用的是国产软件内置浏览器，请点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        case "inQQ":
            info.innerHTML = "<font size='6'><b>提示：<br>请使用非国产软件内置浏览器访问本页面，你可以点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        default:
            return false;
    }
}
