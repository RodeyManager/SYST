;(function(SYST){

    var Validate = function(){
        this.__instance_SYST__ = 'SYST Validate';
        this.__Name__ = 'Validate';
    };
    SYST.Validate = function(){
        return SYST.extendClass(arguments, Validate);
    };
    SYST.V = Validate.prototype = {
        //为空时
        isEmpty     : function(val){        return (!val || val.length === 0 || val == null) ? true : false; },
        //是否含有中文 （flag存在则完全匹配中文，默认不完全匹配）
        isCN        : function(str, flag){
            if(flag)                        return (/^[\u4e00-\u9fa5]+$/.test(str));
            else                            return (/[\u4e00-\u9fa5]+/gi.test(str));
        },
        //验证 E-mail 地址
        isEmail     : function(email){      return /^([a-z0-9]+([\.\-_]?[a-z0-9]+)?)@([a-z0-9]+)\.([a-z0-9]+(\.[a-z0-9]+)?)$/i.test(email); },
        //验证 URL 地址
        isURL       : function(url){        return /^http:\/\/[\w\d]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i.test(url); },
        //验证电话号码
        isTel       : function(tel){        return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/gi.test(tel); },
        //验证手机号码
        isMobile    : function(mobile){     return /^1[3|4|5|7|8]{1}\d{9}$/.test(mobile); },
        //邮编
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
        isObject    : function(value){      return toString.call(value) === '[object Object]'; },
        isFunction  : function(value){      return typeof value === 'function'; },
        isFile      : function(value){      return toString.call(value) === '[object File]'; },
        isBlob      : function(value){      return toString.call(value) === '[object Blob]'; },
        isBoolean   : function(value){      return typeof value === 'boolean'; },
        isdefined   : function(value){      return typeof value !== 'undefined';},
        isRegExp    : function(value){      return toString.call(value) === '[object RegExp]'; },
        isWindow    : function(value){      return value && value.document && value.location && value.alert && value.setInterval; },
        isDocument  : function(value){      return value != null && value.nodeType == value.DOCUMENT_NODE },
        isElement   : function(value){      return !!(value && value.nodeName && value.nodeType); },
        isNodeList  : function(value){      return toString.call(value) === '[object NodeList]'; },
        isBetween   : function(value, min, max, flag){
            return flag ? (value.length >= min && value.length <= max) : (value.length > min && value.length < max);
        }

    };


})(SYST);