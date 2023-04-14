window.config = {
    setLicense: "123456", //许可码
    setProxy: "i.pixiv.re", //Pixiv图片代理
    setPixivAPI: "pixiv.re", //Pixiv PID查图API
    setSize: "regular", //在网页展示的图片规格（original，regular，small，thumb，mini）
    setShowTags: 5, //在网页展示的图片Tag数目，设置为0为全部展示
    maxNumber: 20, //设置允许查找图片的最大数目（小于等于20）
    hideR18: false, //设置是否屏蔽R18作品
    htmlIcon: "" //设置网页图标
}
Object.freeze(window.config); //冻结配置
