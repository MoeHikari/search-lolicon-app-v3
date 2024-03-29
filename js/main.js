pathname = window.location.pathname;
window.filename = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
var verified = readCookie("verified");
if (verified != "true") {
    window.location.href = "verify.html";
    throw SyntaxError();
}
var logined = readCookie("logined");
if (logined != "true") {
    window.location.href = "login.html";
    throw SyntaxError();
}
if (window.config.hideR18 == true && window.filename == "main.html") {
    window.location.href = "main2.html";
    throw SyntaxError();
}
var submitBlock = false;
document.getElementById('bigimg').innerHTML = "<h3 style=\"text-align:center;\">加载完成</h3><input id='submit' type='submit' value='Link Start !' onclick=\"openTools()\">";
window.onload = function () {
    var img = new Image();
    img.src = "https://imgapi.nahida.xin/random";
    if (img.width == 0) {
        var fixBg = document.createElement("style");
        fixBg.innerText = ".overlay:before{background:url(./css/background.png) no-repeat;background-size:cover;background-position:center 0;}";
        document.body.appendChild(fixBg);
    }
}
function openTools() {
    var icon = document.querySelector('link[rel*="icon"]');
    icon.href = window.config.htmlIcon;
    document.getElementById('numberInfo').innerHTML = "获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='1' min='1' max='" + window.config.maxNumber + "' />张";
    runTool();
    createToast("success", "欢迎使用！<br>提示：点击图片可查看原图哦！", true, 3);
    document.getElementById("imgLayer").style.display = "none";
    document.getElementById("imgBoxl").style.display = "none";
}
function radioCheck1(id) {
    if (document.getElementById('number')) {
        document.getElementById('numberInfo').innerHTML = "获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='" + document.getElementById('number').value + "' min='1' max='" + window.config.maxNumber + "' />张";
    } else {
        document.getElementById('numberInfo').innerHTML = "获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='1' min='1' max='" + window.config.maxNumber + "' />张";
    }
    document.getElementById('keyword').placeholder = "请输入搜索关键词";
    for (var i = 0; i <= 3; i++) {
        if (i == id) {
            continue;
        }
        document.getElementById('radio' + i).checked = null;
    }
}
function radioCheck2() {
    document.getElementById('numberInfo').innerHTML = "注：此工具最多可获取100页的图片";
    document.getElementById('keyword').placeholder = "请输入作品PID";
    for (var i = 0; i <= 2; i++) {
        document.getElementById('radio' + i).checked = null;
    }
}
function unfoldTag(node) {
    var parentSetu = node.parentElement;
    var moreTag = parentSetu.querySelector("#more");
    moreTag.style.display = "inline";
    node.style.display = "none";
}
function getSetu(data) {
    var request = new XMLHttpRequest();
    request.open("post", "get.php", true);
    request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    request.send("url=" + encodeURIComponent("https://api.lolicon.app/setu/v2?" + encodeURI(data)));
    return new Promise(function(resolve) {
        request.onload = function() {
            if (request.status == 200) {
                let setu = JSON.parse(request.responseText);
                resolve(setu);
            } else {
                resolve(null);
            }
        }
    });
}
function isAvailableURL(url) {
    var request = new XMLHttpRequest();
    request.open("head", url);
    request.send(null);
    return new Promise(function(resolve, reject) {
        request.onload = function() {
            if (request.status == 200) {
                resolve();
            } else {
                reject();
            }
        }
        request.onerror = function() {
            reject();
        }
    });
}
async function runTool() {
    var keyword = document.getElementById("keyword").value;
    before = ['，', '｜', 'uid', 'pid', '：'];
    after = [',', '|', 'UID', 'PID', ':'];
    before.forEach(function(value, index) {
        keyword = keyword.replace(value, after[index]);
    });
    for (var i = 0; i <= 3; i++) {
        var radio = document.getElementById('radio' + i);
        if (radio.checked == true) {
            var r18 = i;
            break;
        }
    }
    var setuObj = document.getElementById("setuObj");
    if (submitBlock == false) {
        setuObj.innerHTML = null;
    }
    if (r18 == 3) {
        if (submitBlock == true) {
            createToast("warning", "请稍等，上一张图片还未完成", true, 3);
            return;
        }
        createToast("info", "请稍等，可能需要一点时间加载", true, 3);
        submitBlock = true;
        var pid = keyword.replace(/[^\d]/g,'');
        var pixURL = "https://" + window.config.setPixivAPI + "/" + pid;
        var pageTypeArr = ['-1.png', '.png', '-1.jpg', '.jpg', '-1,gif', '.gif'];
        var url = "";
        var finish = false;
        var moreImg = false;
        var imgType = ".png";
        for (let pti = 0; pti < 6; pti++) {
            url = pixURL + pageTypeArr[pti];
            await isAvailableURL(url).then(function() {
                finish = true;
                if (pageTypeArr[pti].indexOf("-1") != -1) {
                    moreImg = true;
                    imgType = (
                        pageTypeArr[pti] == "-1.png" && ".png"
                    ) || (
                        pageTypeArr[pti] == "-1.jpg" && ".jpg"
                    ) || (
                        pageTypeArr[pti] == "-1.gif" && ".gif"
                    );
                }
            }, function() {
                if (pti >= 5) {
                    url = "no url";
                    finish = true;
                } else {
                    finish = false;
                }
            });
            if (finish == true) {
                break;
            }
        }
        if (url == "no url") {
            createToast("error", "没有搜索结果", true, 3);
            setuObj.innerHTML = "<div class='notice'><p>404 Not Found</p></div><br>";
            submitBlock = false;
            return;
        }
        if (moreImg == true) {
            setuObj.innerHTML = "<div class='notice'>Page.1<br><img src='" + url + "' width='100%'/></div><br>";
            createToast("info", "请稍等，还有更多图片需要加载", true, 3);
            finish = false;
            for (let imgp = 2; imgp < 101; imgp++) {
                url = pixURL + "-" + String(imgp) + imgType;
                await isAvailableURL(url).then(function() {
                    setuObj.innerHTML = setuObj.innerHTML + "<div class='notice'>Page." + String(imgp) + "<br><img src='" + url + "' width='100%'/></div><br>";
                }, function() {
                    finish = true;
                });
                if (finish == true) {
                    break;
                }
            }
        } else {
            setuObj.innerHTML = "<div class='notice'><img src='" + url + "' width='100%'/></div><br>";
        }
        createToast("success", "加载完成", true, 3);
        submitBlock = false;
    } else {
        var number = document.getElementById("number").value;
        if (number > window.config.maxNumber) {
            number = window.config.maxNumber;
        }
        var judgments = [keyword.indexOf(","), keyword.indexOf("|"), keyword.indexOf("UID:")];
        if (judgments != [-1, -1, -1]) {
            var setuValue = keyword.split(',');
            var setuData = "";
            var uidData = "";
            setuValue.forEach(function(value) {
                if (value.indexOf("UID:") != -1) {
                    uidData = uidData + "uid=" + value.replace(/[^\d]/g,'') + "&";
                    return;
                }
                setuData = setuData + "tag=" + value + "&";
            });
            setuData = setuData + uidData;
        } else {
            var setuData = "keyword=" + keyword + "&";
        }
        var setuData = setuData + "r18=" + r18 + "&num=" + number + "&proxy=" + window.config.setProxy + "&size=original&size=" + window.config.setSize;
        var setuInfo = {};
        await getSetu(setuData).then(function(setuJson) {
            setuInfo = setuJson.data;
        });
        if (setuInfo.length == 0) {
            createToast("error", "没有搜索结果", true, 3);
            setuObj.innerHTML = "<div class='notice'><p>404 Not Found</p></div><br>";
            return;
        }
        var setuNum = "";
        var setuURL = "";
        var setuOpInfo = "";
        var setuDownload = "";
        var setuMode = "";
        var setuTag = "";
        var setuMoreTag = "";
        var setuTagArr = [];
        var loadError = 0;
        setuInfo.forEach(function(value, index) {
            setuTagArr = value['tags'];
            if ((window.config.hideR18 == true || window.filename == "main2.html") && setuTagArr.indexOf("R-18") != -1) {
                setuObj.innerHTML = setuObj.innerHTML + "<div class='notice'><p>404 Not Found</p></div><br>";
                loadError += 1;
                return;
            }
            var setuAINote = "";
            if (number != 1) {
                setuNum = String(index + 1) + ".";
            }
            setuURL = value['urls'][window.config.setSize];
            setuDownload = value['urls']['original'];
            setuOpInfo = setuNum + "标题：" + value['title'] + "<br>画师：" + value['author'] + "(" + value['uid'] + ")<br>PID：" + value['pid'] + "(第" + (value['p'] + 1) + "页)";
            if (window.config.hideR18 != true && window.filename != "main2.html") {
                setuMode = "<br>是否为R18图：" + value['r18'];
            }
            setuTag = "图片Tag：";
            setuMoreTag = ",";
            setuTagArr.forEach(function(tagValue, tagIndex) {
                if (window.config.setShowTags != 0) {
                    if (tagIndex + 1 > window.config.setShowTags) {
                        setuMoreTag = setuMoreTag + tagValue;
                        if (tagIndex + 1 == setuTagArr.length) {
                            setuTag = setuTag + "<span id='more' style='display:none;'>" + setuMoreTag + "</span><u title='展开' onclick='unfoldTag(this);' style='cursor:pointer;'>...</u>";
                            return;
                        }
                        setuMoreTag = setuMoreTag + ",";
                        return;
                    }
                    setuTag = setuTag + tagValue;
                    if (tagIndex + 1 < window.config.setShowTags && tagIndex + 1 < setuTagArr.length) {
                        setuTag = setuTag + ",";
                    }
                    return;
                }
                setuTag = setuTag + tagValue;
                if (tagIndex + 1 == setuTagArr.length) {
                    return;
                }
                setuTag = setuTag + ",";
            });
            if (value['aiType'] == 2) {
                setuAINote = "<br>提示：这是一幅AI绘制的作品";
            }
            setuObj.innerHTML = setuObj.innerHTML + "<div class='notice'><p>" + setuOpInfo + setuMode + "<br>" + setuTag + setuAINote + "</p><a href='" + setuDownload + "' target='_blank'><img src='" + setuURL + "' alt='404 Not Found' title='点击查看原图' width='100%'/></a></div><br>";
        });
        if (loadError != 0) {
            if (setuInfo.length >= 2 && loadError < setuInfo.length) {
                createToast("warning", "部分图片加载失败", true, 3);
                loadError = 0;
            } else {
                createToast("error", "图片加载失败", true, 3);
                loadError = 0;
            }
        }
    }
}
