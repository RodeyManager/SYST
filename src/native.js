;(function(SYST){

    var ua = navigator.userAgent.toUpperCase(),
        // 当前环境是否为Android平台
        IS_ANDROID = ua.indexOf('ANDROID') !== -1,
        // 当前环境是否为IOS平台
        IS_IOS = ua.indexOf('IPHONE OS') !== -1,
        // 当前环境是否为本地Native环境
        IS_NATIVE = (IS_ANDROID || IS_IOS) ? true : false,
        //判断是否为移动设备
        IS_PHONE = ua.indexOf('MOBILE') !== -1,
        IS_PAD = ua.indexOf('IPAD') !== -1,
        IS_MOBILE = (IS_PHONE || IS_PAD) ? true : false;

    var Native = function(){
        this.__instance_SYST__ = 'SYST Native';
        this.__Name__ = 'SYST Native';
    };
    SYST.Native = function(){
        return SYST.extendClass(arguments, Native);
    };
    SYST.N = Native.prototype = {
        UA          : ua,
        isAndroid   : IS_ANDROID,
        isIos       : IS_IOS,
        isNative    : IS_NATIVE,
        isPhone     : IS_PHONE,
        isPad       : IS_PAD,
        isMobile    : IS_MOBILE,
        callNative  : function(name){
            //TODO......
        }
    };

})(SYST);
