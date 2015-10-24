/**
 * Created by Rodey on 2015/10/23.
 */

    /// <reference path="zepto.d.ts" />
module YT {
    export class Tools {

        private _v: YT.Validate;
        private _pars:any;

        public constructor(child?:any) {
            this._v = new YT.Validate();
            for (var k in child) {
                if (child.hasOwnProperty(k))
                    Object.defineProperty(this, k, { value: child[k], writable: false });
            }
        }

        public template(htmlStr: string, tagPanel: string) {
            var element: any = document.createElement(tagPanel || 'div');
            element.innerHTML = htmlStr;
            //jQuery || zepto
            if ($) {
                $(element).html(htmlStr);
                return $(element);
            }
            return element.childNodes;
        }

        /**
         * Function 触发事件
         * @param  {[type]}   element  [触发对象]
         * @param  {[type]}   event    [事件名称]
         * @param  {[type]}   data     [参数]
         * @param  {Function} callback [回调]
         * @return {[type]}            [undefined]
         * use:
         * $(document.body).bind('click', function(){});
         * SYST.T.trigger($(document.body)[0], 'onclick', 'hello', function(data){
         *     console.log(this); //output:     <body>...</body。
         *     console.log(data); //output；    'hello'
         * });
         */
        public trigger(element: any, event: string, data: any, callback: Function) {
            if (element && event && '' !== event) {
                try {
                    element[event].call(element, data, arguments);
                    if (typeof callback === 'function') callback.call(element, data);
                } catch (e) {
                    throw new Error(element + '不存在' + event + '方法 <::>');
                }
            }
        }

        /**
         * Function 去除两边空白
         * @param val
         * @return {*|void}
         */
        public trim(val: string) {
            return val.replace(/^\s*|\s*$/gi, '');
        }

        /**
         * Function 去除字符串首尾指定的字符
         * @param val       : 将要进行替换的字符串
         * @param commer    : 指定要替换的字符串
         * @param flag      : true: 全局替换；false: 只替换首尾
         * @return          : 返回替换后的字符串
         */
        public rtrim(val: string, commer: string, flag: boolean) {
            if (commer) {
                var re: any;
                if (!flag)
                    re = new RegExp('^(\\' + commer + ')*|(\\' + commer + ')*$', 'gi');
                else
                    re = new RegExp('\\' + commer + '*', 'gi');
                return val.replace(re, '');
            } else {
                return this.trim(val);
            }
        }

        /**
         * Function 判断数组是否存在某元素  存在： 返回该元素索引； 不存在： 返回 -1
         * @param array
         * @param obj
         * @return {*}
         */
        public indexOf(array: Array<any>, obj: any) {
            if (array.indexOf) return array.indexOf(obj);
            for (var i = 0; i < array.length; i++) {
                if (obj === array[i]) return i;
            }
            return -1;
        }

        /**
         * 从数组中删除指定的元素, 返回被指定的元素（ 执行后原数值array将移除指定的元素 ）
         * @param array
         * @param val
         * @return {*}
         */
        public arrRemove(array: Array<any>, val: any) {
            var index = this.indexOf(array, val);
            if (index >= 0)
                array.splice(index, 1);
            return val;
        }

        /**
         * Function 全角字符转为半角,并去除所有空格
         * @param str
         * @return {String}
         * @constructor
         */
        public F2C(str: string) {
            var s = "", str = str.replace(/\s*/gi, '');
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if (c == 12288) {
                    s += String.fromCharCode(32);
                    continue;
                }
                if (c > 65280 && c < 65375) {
                    s += String.fromCharCode(c - 65248);
                    continue;
                }
                s += String.fromCharCode(c);
            }
            s = s.replace(/\s*/gi, '');
            return s.toUpperCase();
        }

        /**
         * Function 格式化小于10的值
         * @param n
         * @return {String}
         */
        public dateFm(n: number) {
            return (n < 10) ? '0' + n : n;
        }

        /**
         * Function 将指定时间戳转为： yyyy-mm-dd hh:ii:ss
         * @param timestamp
         * @return {String}
         */
        public setDateFormat(timestamp: string, format?: string, prefix?: boolean) {
            if (this._v.isEmpty(timestamp)) return '';
            var self = this;
            var date: any = new Date(parseInt(timestamp, 10)), ds: Array<any> = [], ts: Array<any> = [];
            if (!format)
                return date.getFullYear() + '-' + this.dateFm(date.getMonth() + 1) + '-' + this.dateFm(date.getDate()) + ' ' + this.dateFm(date.getHours()) + ':' + this.dateFm(date.getMinutes()) + ':' + this.dateFm(date.getSeconds());
            var cs = format.match(/[^\w\d\s]+?/i), c1 = cs[0] || '-', c2 = cs[1] || ':';
            if (/y+?/i.test(format))     push(date.getFullYear(), ds);
            if (/m+?/i.test(format))     push(date.getMonth() + 1, ds);
            if (/d+?/i.test(format))     push(date.getDate(), ds);
            if (/h+?/i.test(format))     push(date.getHours(), ts);
            if (/i+?/i.test(format))     push(date.getMinutes(), ts);
            if (/s+?/i.test(format))     push(date.getSeconds(), ts);
            function push(value: number, toAr: Array<any>) {
                toAr.push(prefix ? self.dateFm(value) : value);
            }

            return this.trim(ds.join(c1) + (ts.length > 0 ? ' ' + ts.join(c2) : ''));
        }

        /**
         * Function 比较两个时间差 格式：YYYY-mm-dd
         * @param DateOne
         * @param DateTwo
         * @return {Number}
         */
        public daysBetween(DateOne: string, DateTwo: string, callback?: Function) {
            //获取第一个时间
            var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
            var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
            var OneYear = DateOne.substring(0, DateOne.indexOf('-'));
            //获取第二个时间
            var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
            var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
            var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

            var CDays = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);

            if (callback && typeof callback === 'function') {
                callback(CDays);
            } else {
                //return Math.abs(CDays);
                return CDays;
            }
        }

        /**
         * Function 获取指定参数或者所有参数列表
         * @param name
         * @returns {*}
         */
        public params(name?: string, url?: string) {
            if (this._pars && this._pars[name])
                return this._pars[name];
            var search: string = (url ? url.split('?')[1] : location.search || location.href.split('?')[1]).replace(/^\?/, '');
            if (this._v.isEmpty(search)) return {};
            var mas: any = search.split('&');
            if (!mas || [] === mas) return null;
            var i: number = 0, len: number = mas.length, ps: any = {};
            for (; i < len; ++i) {
                //a=b | a=
                var ma: any = mas[i].split('=');
                if (!ma[0] || '' === ma[0])  continue;
                Object.defineProperty(ps, ma[0], {
                    value: decodeURI(ma[1]) || null,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            this._pars = ps;
            return (!name ? ps : decodeURI(ps[name]));

        }

        //获取get模式下url中的指定参数值
        public getParams(name: string, url?: string) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = (url && url.split('?')[1] || window.location.search.substr(1)).match(reg);
            if (r) {
                return decodeURI(r[2]);
            }
            return null;
        }

        //格式化参数 flag: 表示前面是否加上‘?’返回，true: 加上；false: 不加(默认)
        public paramData(object: any, flag?: boolean) {
            if (this._v.isEmpty(object) || !this._v.isObject(object))  return '';
            var data = object, s = '';
            for (var k in data)  (s += '&' + k + '=' + encodeURI(data[k]));
            s = s.substr(1);
            return (flag === true) ? '?' + s : s;
        }

        /**
         * Function 浏览器 cookie操作
         * @param key       键名
         * @param value     键值
         * @param options   附件选项
         * @returns {*}
         * @constructor
         */
        public Cookie(key: string, value?: any, options?: any) {
            if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                options = options || {};

                if (value === null || value === undefined) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days: any = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                value = String(value);

                return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
            }
            options = value || {};
            var decode: any = options.raw ? function (s: any) {
                return s;
            } : decodeURIComponent;
            var pairs = document.cookie.split('; ');
            for (var i: number = 0, pair: any; pair = pairs[i] && pairs[i].split('='); i++) {
                if (decode(pair[0]) === key)
                    return decode(pair[1] || '');
            }
            return null;
        }

    }
}
