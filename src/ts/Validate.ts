/**
 * Created by Rodey on 2015/10/23.
 */

module YT {
    export class Validate {

        public constructor(child?: any) {
            for (var k in child) {
                if (child.hasOwnProperty(k))
                    this[k] = child[k];
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
            }
        }

        //为空时
        public isEmpty(val: any) {
            return (!val || val.length === 0 || val === '' || val == null) ? true : false;
        }

        //是否已设置(初始化值)
        public isSet(val: any) {
            return (typeof val !== 'undefined') ? true : false;
        }

        //取两个数值之间 (默认不包括两者, flag=>true 包括)
        public between(val: any, min: number, max: number, flag: boolean) {
            flag = flag || false;
            if (flag)                        return (val.length >= min && val.length <= max) ? true : false;
            else                            return (val.length > min && val.length < max) ? true : false;
        }

        //是否含有中文 （flag存在则完全匹配中文，默认不完全匹配）
        public isCN(str: string, flag: boolean) {
            if (flag)                        return (/^[\u4e00-\u9fa5]+$/.test(str));
            else                            return (/[\u4e00-\u9fa5]+/gi.test(str));
        }

        //验证 E-mail 地址
        public isEmail(email: string) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi.test(email);
        }

        //验证 URL 地址
        public isURL(url: string) {
            return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/i.test(url);
        }

        //验证电话号码
        public isTel(tel: string) {
            return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/gi.test(tel);
        }

        //验证手机号码
        public isMobile(mobile: any) {
            return /^1[3|4|5|7|8]{1}\d{9}$/.test(mobile);
        }

        public isZip(zipCode: string) {
            return /^\d{6}$/.test(zipCode);
        }

        //验证日期, 日期时间, 时间
        public isDateLocal(date: string) {
            return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(date);
        }

        public isDateTime(dateTime: string) {
            return /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(dateTime);
        }

        public isTime(time: string) {
            return /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(time);
        }

        //常用对象判断
        public isNull(value: any) {
            return value == null;
        }
        public isString(value: any) {
            return value && typeof value === 'string';
        }

        public isNumber(value: any) {
            return value != null && typeof value === 'number';
        }

        public isArray(value: any) {
            return value && toString.call(value) === '[object Array]';
        }

        public isDate(value: any) {
            return value && toString.call(value) === '[object Date]';
        }

        public isObject(value: any) {
            return value && typeof value === 'object';
        }

        public isFunction(value: any) {
            return value && typeof value === 'function';
        }

        public isFile(value: any) {
            return value && toString.call(value) === '[object File]';
        }

        public isBlob(value: any) {
            return value && toString.call(value) === '[object Blob]';
        }

        public isBoolean(value: any) {
            return typeof value === 'boolean';
        }

        public isdefined(value: any) {
            return typeof value !== 'undefined';
        }

        public isRegExp(value: any) {
            return value && toString.call(value) === '[object RegExp]';
        }

        public isWindow(value: any) {
            return value && value.document && value.location && value.alert && value.setInterval;
        }

        public isElement(value: any) {
            return !!(value && (value.nodeName || (value.prop && value.attr && value.find)));
        }

    }
}
