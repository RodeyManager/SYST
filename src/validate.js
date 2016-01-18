/**
 * Created by Rodey on 2015/10/16.
 *
 * Module web通用验证数据对象
 * @type {Function}
 */

;(function(SYST){

    'use strict';


    var Validate = SYST.Validate = function(child){
        this.__Name__ = 'Validate';
        if(child){
            child.__SuperName__ = 'SYST Validate';
            child = SYST.extend(SYST.Validate.prototype, child);
            return child;
        }else{
            return new SYST.Validate({});
        }
    };
    SYST.V = SYST.Validate.prototype = {
        //为空时
        isEmpty     : function(val){        return (!val || val.length === 0 || val === '' || val == null) ? true : false; },
        //是否已设置(初始化值)
        isSet       : function(val){        return (typeof val !== 'undefined') ? true : false; },
        //取两个数值之间 (默认不包括两者, flag=>true 包括)
        between     : function(val, min, max, flag){
            flag = flag || false;
            if(flag)                        return (val.length >= min && val.length <= max) ? true : false;
            else                            return (val.length > min && val.length < max) ? true : false;
        },
        //是否含有中文 （flag存在则完全匹配中文，默认不完全匹配）
        isCN        : function(str, flag){
            if(flag)                        return (/^[\u4e00-\u9fa5]+$/.test(str));
            else                            return (/[\u4e00-\u9fa5]+/gi.test(str));
        },
        //验证 E-mail 地址
        isEmail     : function(email){      return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi.test(email); },
        //验证 URL 地址
        isURL       : function(url){        return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i.test(url); },
        //验证电话号码
        isTel       : function(tel){        return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/gi.test(tel); },
        //验证手机号码
        isMobile    : function(mobile){     return /^1[3|4|5|7|8]{1}\d{9}$/.test(mobile); },
        isZip       : function(zipCode){    return /^\d{6}$/.test(zipCode); },
        //验证日期, 日期时间, 时间
        isDateLocal : function(date){       return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(date); },
        isDateTime  : function(dateTime){   return /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(dateTime); },
        isTime      : function(time){       return /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(time); },
        //常用对象判断
        isNull      : function(value){      return value == null; },
        isString    : function(value){      return typeof value === 'string'; },
        isNumber    : function(value){      return typeof value === 'number'; },
        isArray     : function(value){      return toString.call(value) === '[object Array]'; },
        isDate      : function(value){      return toString.call(value) === '[object Date]'; },
        isObject    : function(value){      return value != null && typeof value === 'object'; },
        isFunction  : function(value){      return typeof value === 'function'; },
        isFile      : function(value){      return toString.call(value) === '[object File]'; },
        isBlob      : function(value){      return toString.call(value) === '[object Blob]'; },
        isBoolean   : function(value){      return typeof value === 'boolean'; },
        isdefined   : function(value){      return typeof value !== 'undefined';},
        isRegExp    : function(value){      return toString.call(value) === '[object RegExp]'; },
        isWindow    : function(value){      return value && value.document && value.location && value.alert && value.setInterval; },
        isElement   : function(value){      return !!(value && (value.nodeName || (value.prop && value.attr && value.find))); }

    };


})(SYST);