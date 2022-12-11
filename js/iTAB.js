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
    switch (app) {
        case "inWeiXin":
            "<font size='6'><b>提示：<br>请使用非国产软件内置浏览器访问本页面，你可以点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        case "WPBrowser":
            "<font size='6'><b>提示：<br>您使用的可能是Windows Phone平台，我们无法判断您的浏览器，请确保您是使用非国产软件内置浏览器访问的本页面后点击<a href='login.html'><button name='WPBrowser' value='true'>继续</button></a>；亦或者，如果您使用的是国产软件内置浏览器，请点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        case "inQQ":
            "<font size='6'><b>提示：<br>请使用非国产软件内置浏览器访问本页面，你可以点击右上角的“···”按钮选择“在默认浏览器中打开”，谢谢</b></font>"
            return true;
        default:
            return false;
    }
}
