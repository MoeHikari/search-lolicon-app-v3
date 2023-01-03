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
    document.getElementById('numberInfo').innerHTML = "获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='1' min='1' max='" + window.config.maxNumber + "' />张";
    runTool();
    createToast("success", "欢迎使用！", true, 3);
    document.getElementById("imgLayer").style.display = "none";
    document.getElementById("imgBoxl").style.display = "none";
}
function radioCheck1(id) {
    document.getElementById('numberInfo').innerHTML = "获取数量(1-" + window.config.maxNumber + ")：<input id='number' type='number' name='number' value='" + document.getElementById('number').value + "' min='1' max='" + window.config.maxNumber + "' />张";
    for (var i=0; i<=3; i++) {
        if (i == id) {
            continue;
        }
        document.getElementById('radio' + i).checked = null;
    }
}
function radioCheck2() {
    document.getElementById('numberInfo').innerHTML = "";
    for (var i=0; i<=2; i++) {
        document.getElementById('radio' + i).checked = null;
    }
}
$(function() {
    $.fn.getSetu = function(data) {
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
    };
});
function isAvailableURL(url){
    return new Promise(function(resolve, reject) {
        var dom = document.createElement('link');
        dom.href = url;
        dom.rel = 'stylesheet';
        document.head.appendChild(dom);
        dom.onload = function() {
            document.head.removeChild(dom);
            resolve();
        };
        dom.onerror = reject;
    });
}
async function runTool() {
    var keyword = document.getElementById("keyword").value;
    before = ['，', '｜', 'uid', 'pid', '：'];
    after = [',', '|', 'UID', 'PID', ':'];
    before.forEach(function(value, index) {
        keyword = keyword.replace(value, after[index]);
    });
    for (var i=0; i<=3; i++) {
        var radio = document.getElementById('radio' + i);
        if (radio.checked == true) {
            var r18 = i;
            break;
        }
    }
    var number = document.getElementById("number").value;
    if (number == null) {
        number = 1;
    }
    var setuObj = document.getElementById("setuObj");
    setuObj.innerHTML = null;
    if (r18 == 3) {
        var pid = keyword.replace(/[^\d]/g,'');
        var pixURL = "https://" + window.config.setPixivAPI + "/" + pid;
        var fileTypeArr = ['.png', '.jpg', '.gif'];
        var pageTypeArr = ['-' + number, '-1', ''];
        var url = "";
        try {
            fileTypeArr.forEach(async function(fValue) {
                pageTypeArr.forEach(async function(pValue) {
                    url = pixURL + pValue + fValue;
                    await isAvailableURL(url).then(function(){
                        throw new Error('break forEach.');
                    }, function(){
                        url = "no url";
                    });
                });
            });
        } catch(e) {
            console.log(e.message);
        }
        if (url == "no url") {
            createToast("error", "没有搜索结果", true, 3);
            setuObj.innerHTML = "<div class='notice'><p>404 Not Found</p></div><br>";
            return;
        }
        setuObj.innerHTML = "<div class='notice'><img src='" + url + "' width='100%'/></div><br>";
    } else {
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
        setu = $().getSetu(setuData + "r18=" + r18 + "&num=" + number + "&proxy=" + window.config.setProxy + "&size=original&size=" + window.config.setSize).data;
        if (setu.length == 0) {
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
        setu.forEach(function(value, index) {
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
