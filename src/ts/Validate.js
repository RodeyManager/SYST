/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Validate = (function () {
        function Validate(child) {
            for (var k in child) {
                if (child.hasOwnProperty(k))
                    this[k] = child[k];
            }
        }
        //为空时
        Validate.prototype.isEmpty = function (val) {
            return (!val || val.length === 0 || val === '' || val == null) ? true : false;
        };
        //是否已设置(初始化值)
        Validate.prototype.isSet = function (val) {
            return (typeof val !== 'undefined') ? true : false;
        };
        //取两个数值之间 (默认不包括两者, flag=>true 包括)
        Validate.prototype.between = function (val, min, max, flag) {
            flag = flag || false;
            if (flag)
                return (val.length >= min && val.length <= max) ? true : false;
            else
                return (val.length > min && val.length < max) ? true : false;
        };
        //是否含有中文 （flag存在则完全匹配中文，默认不完全匹配）
        Validate.prototype.isCN = function (str, flag) {
            if (flag)
                return (/^[\u4e00-\u9fa5]+$/.test(str));
            else
                return (/[\u4e00-\u9fa5]+/gi.test(str));
        };
        //验证 E-mail 地址
        Validate.prototype.isEmail = function (email) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi.test(email);
        };
        //验证 URL 地址
        Validate.prototype.isURL = function (url) {
            return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i.test(url);
        };
        //验证电话号码
        Validate.prototype.isTel = function (tel) {
            return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/gi.test(tel);
        };
        //验证手机号码
        Validate.prototype.isMobile = function (mobile) {
            return /^1[3|4|5|7|8]{1}\d{9}$/.test(mobile);
        };
        Validate.prototype.isZip = function (zipCode) {
            return /^\d{6}$/.test(zipCode);
        };
        //验证日期, 日期时间, 时间
        Validate.prototype.isDateLocal = function (date) {
            return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(date);
        };
        Validate.prototype.isDateTime = function (dateTime) {
            return /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(dateTime);
        };
        Validate.prototype.isTime = function (time) {
            return /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(time);
        };
        //常用对象判断
        Validate.prototype.isString = function (value) {
            return typeof value === 'string';
        };
        Validate.prototype.isNumber = function (value) {
            return typeof value === 'number';
        };
        Validate.prototype.isArray = function (value) {
            return toString.call(value) === '[object Array]';
        };
        Validate.prototype.isDate = function (value) {
            return toString.call(value) === '[object Date]';
        };
        Validate.prototype.isObject = function (value) {
            return value != null && typeof value === 'object';
        };
        Validate.prototype.isFunction = function (value) {
            return typeof value === 'function';
        };
        Validate.prototype.isFile = function (value) {
            return toString.call(value) === '[object File]';
        };
        Validate.prototype.isBlob = function (value) {
            return toString.call(value) === '[object Blob]';
        };
        Validate.prototype.isBoolean = function (value) {
            return typeof value === 'boolean';
        };
        Validate.prototype.isdefined = function (value) {
            return typeof value !== 'undefined';
        };
        Validate.prototype.isRegExp = function (value) {
            return toString.call(value) === '[object RegExp]';
        };
        Validate.prototype.isWindow = function (value) {
            return value && value.document && value.location && value.alert && value.setInterval;
        };
        Validate.prototype.isElement = function (value) {
            return !!(value && (value.nodeName || (value.prop && value.attr && value.find)));
        };
        return Validate;
    })();
    YT.Validate = Validate;
})(YT || (YT = {}));
//# sourceMappingURL=Validate.js.map