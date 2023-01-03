var submitBlock = false;
window.onload = async function () {
    var verified = readCookie("verified");
    if (verified != "true") {
        window.location.href = "index.html";
        return;
    }
    var logined = readCookie("logined");
    if (logined != "true") {
        window.location.href = "index.html";
        return;
    }
    await getConfig();
    document.getElementById('bigimg').innerHTML = "<h3 style=\"text-align:center;\">加载完成</h3><input id='submit' type='submit' value='Link Start !' onclick=\"openTools()\">";
    var img = new Image();
    img.src = "https://dev.iw233.cn/api.php?sort=random";
    if (img.width == 0) {
        var fixBg = document.createElement("style");
        fixBg.innerText = ".overlay:before{background:url(./css/background.png) no-repeat;background-size:cover;background-position:center 0;}";
        document.body.appendChild(fixBg);
    }
};
function openTools(){
    pathname = window.location.pathname;
    window.filename = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
    if (window.config.hideR18 == true && window.filename == "main.html") {
        window.location.href = "main2.html";
    }
    var icon = document.querySelector('link[rel*="icon"]');
    icon.href = window.config.htmlIcon;
    document.getElementById('numberInfo').innerHTML = "<br>获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='1' min='1' max='" + window.config.maxNumber + "' />张";
    runTool();
    createToast("success", "欢迎使用！", true, 3);
    document.getElementById("imgLayer").style.display = "none";
    document.getElementById("imgBoxl").style.display = "none";
}
function radioCheck1(id) {
    if (document.getElementById('number')) {
        document.getElementById('numberInfo').innerHTML = "<br>获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='" + document.getElementById('number').value + "' min='1' max='" + window.config.maxNumber + "' />张";
    } else {
        document.getElementById('numberInfo').innerHTML = "<br>获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='1' min='1' max='" + window.config.maxNumber + "' />张";
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
    document.getElementById('numberInfo').innerHTML = "<br>注：此工具最多可获取100页的图片";
    document.getElementById('keyword').placeholder = "请输入作品PID";
    for (var i = 0; i <= 2; i++) {
        document.getElementById('radio' + i).checked = null;
    }
}
function getSetu(data) {
    var setu = $.ajax({
        type: "post",
        url: "get.php",
        data: {
            "url": "https://api.lolicon.app/setu/v2?" + encodeURI(data)
        },
        async: false,
        dataType: "json"
    });
    return setu.responseJSON;
}
function isAvailableURL(url){
    return new Promise(function(resolve, reject) {
        var tester = $.ajax({
            type: "head",
            url: url,
            async: true,
            success: function(r) {
                resolve();
            },
            error: function(e) {
                reject();
            }
        });
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
            createToast("warning", "请稍等，上一张图片还未加载完成", true, 3);
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
        var setuInfo = getSetu(setuData + "r18=" + r18 + "&num=" + number + "&proxy=" + window.config.setProxy + "&size=original&size=" + window.config.setSize).data;
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
            setuOpInfo = setuNum + "标题：" + value['title'] + "&ensp;<a href='" + setuDownload + "' target='_blank'><button id='download'>下载原图</button></a>" + "<br>画师：" + value['author'] + "(" + value['uid'] + ")<br>PID：" + value['pid'] + "(第" + (value['p'] + 1) + "页)";
            if (window.config.hideR18 != true && window.filename != "main2.html") {
                setuMode = "<br>是否为R18图：" + value['r18'];
            }
            setuTag = "图片Tag：";
            try {
                setuTagArr.forEach(function(tagValue, tagIndex) {
                    setuTag = setuTag + tagValue;
                    if (window.config.setShowTags != 0 && tagIndex + 1 == window.config.setShowTags) {
                        setuTag = setuTag + "...";
                        throw new Error('break forEach.');
                    } else if (window.config.setShowTags == 0 && tagIndex + 1 == setuTagArr.length) {
                        throw new Error('break forEach.');
                    } else {
                        setuTag = setuTag + ",";
                    }
                });
            } catch(e) {
                console.log(e.message);
            }
            if (value['aiType'] == 2) {
                setuAINote = "<br>提示：这是一幅AI绘制的作品";
            }
            setuObj.innerHTML = setuObj.innerHTML + "<div class='notice'><p>" + setuOpInfo + setuMode + "<br>" + setuTag + setuAINote + "<br></p><img src='" + setuURL + "' width='100%'/></div><br>";
        });
        if (loadError != 0) {
            if (setu.length >= 2 && loadError < setu.length) {
                createToast("warning", "部分图片加载失败", true, 3);
                loadError = 0;
            } else {
                createToast("error", "图片加载失败", true, 3);
                loadError = 0;
            }
        }
    }
}
