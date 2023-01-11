var iconData = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-circle-exclamation',
    info: 'fa-circle-info'
};
var toastsID = 0;
var toasts = document.createElement("ul");
toasts.className = "toasts";
document.body.appendChild(toasts);
function createToast(id, text, autoclose = false, timer = 5) {
    toastsID += 1;
    if (autoclose == false) timer = 0;
    var thisToastsID = "toast" + String(toastsID);
    var icon = iconData[id];
    var toast = document.createElement("li");
    toast.className = "toast " + id + " " + thisToastsID;
    toast.innerHTML = "<div class='column'><i class='fa-solid " + icon + "'></i><span>" + text + "</span></div><i class='fa-solid fa-xmark' onClick='removeToast(this.parentElement)'></i>";
    var toastStyle = document.createElement("style");
    toastStyle.id = toast.className;
    toastStyle.innerText = "." + thisToastsID + "::before {animation:progress " + timer + "s linear forwards;}";
    document.body.appendChild(toastStyle);
    toasts.appendChild(toast);
    if (autoclose == true) toast.timeoutId = setTimeout(() => removeToast(toast), timer * 1000);
}
function removeToast(toast) {
    var thisToast = toast.className;
    toast.classList.add("hide");
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    var floatToast = document.createElement("li");
    floatToast.className = "floatToast";
    floatToast.style.height = String(toast.offsetHeight + 10) + "px";
    setTimeout(() => {
        toast.style.height = "0px";
        toasts.insertBefore(floatToast, toast);
        toast.remove();
        document.getElementById(thisToast).remove();
        setTimeout(() => {
            floatToast.style.height = "0px";
            setTimeout(() => {floatToast.remove();}, 400);
        }, 200);
    }, 400);
}