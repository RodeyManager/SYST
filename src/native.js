/**
 * Created by Rodey on 2015/10/16.
 *
 * Module Native相关 移动开发工具（web端调用native）
 * @type {Function}
 * USE: //调用native方法 , 未完待续>>>>>>>>
 */

;(function(SYST){

    'use strict';

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

    var Native = SYST.Native = function(child){
        this.__Name__ = 'Native';
        if(child){
            child.__SuperName__ = 'SYST Native';
            child = SYST.extend(SYST.Native.prototype, child);
            return child;
        }else{
            return new SYST.Native({});
        }
    };
    SYST.N = SYST.Native.prototype = {
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
