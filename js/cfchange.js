var cfIfr = null;
while (cfIfr == null) {
    cfIfr = document.querySelector("iframe[tabindex='1']");
}
cfIfr.style = "border:none;overflow:hidden;width:100%;height:65px;";
