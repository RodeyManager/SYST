/**
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var ST = (function () {
    function ST() {
        this.shareModels = YT.ShareModel.getInstance();
        this.V = new YT.Validate();
        this.T = new YT.Tools();
        this.ajax = new YT.Ajax();
    }
    ST.prototype.Model = function (child) {
        return new YT.Model(child);
    };
    ST.prototype.View = function (child) {
        /*this._view = new YT.View(child);
        return this._view;*/
        //return YT.View.getInstance(child);
        return new YT.View(child);
    };
    ST.prototype.Controller = function (child) {
        return new YT.Controller(child);
    };
    ST.prototype.Validate = function (child) {
        return new YT.Validate(child);
    };
    ST.prototype.Tools = function (child) {
        return new YT.Tools(child);
    };
    ST.prototype.Router = function () {
        return new YT.Router();
    };
    ST.noConflict = function () {
        return window['SYST'] || new ST();
    };
    ST.prototype.Render = function (content, data) {
        return this.Tools().render(content, data);
    };
    ST.prototype.Promise = function (resolve, reject) {
        return new YT.Promise(resolve, reject);
    };
    ST.prototype.P = function (resolve, reject) {
        return this.Promise(resolve, reject);
    };
    /**
     * 对象继承
     * @param parent
     * @param child
     * @returns {any}
     */
    ST.extend = function (parent, child) {
        if (!parent || parent === {} || typeof (parent) !== 'object')
            return child;
        if (!child || child === {} || typeof (child) !== 'object')
            return parent;
        if (!child.prototype) {
            child.__super__ = parent;
            var proto;
            for (proto in parent) {
                if (parent.hasOwnProperty(proto)) {
                    child[proto] = parent[proto];
                }
            }
        }
        return child;
    };
    /**
     * 类继承
     * @param d
     * @param b
     */
    ST.extendClass = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function Parent() {
            this.constructor = d;
        }
        d['prototype'] = (b === null) ? Object.create(b) : (new Parent());
    };
    /**
     * 对象拷贝
     * @param targetObject
     * @returns {Object}
     */
    ST.clone = function (targetObject) {
        var target = targetObject, out, proto;
        for (proto in target) {
            if (target.hasOwnProperty(proto)) {
                out[proto] = target[proto];
            }
        }
        return out;
    };
    /**
     * 重置事件监听函数作用域
     * @param object
     * @param func
     * @returns {function(MouseEvent): undefined}
     */
    ST.hoadEvent = function (object, func) {
        var args = [], self = this;
        var obj = object || window;
        for (var i = 2; i < arguments.length; ++i)
            args.push(arguments[i]);
        return function (e) {
            if (e && typeof e === 'object') {
                e.preventDefault();
                e.stopPropagation();
            }
            args.push(e);
            //obj[func].apply(obj, args);
            //保证传递 Event对象过去
            //obj[func].call(obj, e, args);
            if (object[func])
                object[func].call(object, e, args);
            else
                throw new Error(func + ' 函数未定义！');
        };
    };
    //variables static
    ST.author = 'Rodey';
    ST.version = '0.0.5';
    ST.name = 'SYST JS MVC mini Framework (JS MVC框架)';
    ST.root = window;
    ST.$ = $;
    return ST;
})();
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
/**
 * Created by Rodey on 2015/10/23.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Tools = (function () {
        function Tools(child) {
            this._v = new YT.Validate();
            for (var k in child) {
                if (child.hasOwnProperty(k))
                    Object.defineProperty(this, k, { value: child[k], writable: false });
            }
        }
        Tools.prototype.template = function (htmlStr, tagPanel) {
            var element = document.createElement(tagPanel || 'div');
            element.innerHTML = htmlStr;
            //jQuery || zepto
            if ($) {
                $(element).html(htmlStr);
                return $(element);
            }
            return element.childNodes;
        };
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
        Tools.prototype.trigger = function (element, event, data, callback) {
            if (element && event && '' !== event) {
                try {
                    element[event].call(element, data, arguments);
                    if (typeof callback === 'function')
                        callback.call(element, data);
                }
                catch (e) {
                    throw new Error(element + '不存在' + event + '方法 <::>');
                }
            }
        };
        /**
         * Function 去除两边空白
         * @param val
         * @return {*|void}
         */
        Tools.prototype.trim = function (val) {
            return val.replace(/^\s*|\s*$/gi, '');
        };
        /**
         * Function 去除字符串首尾指定的字符
         * @param val       : 将要进行替换的字符串
         * @param commer    : 指定要替换的字符串
         * @param flag      : true: 全局替换；false: 只替换首尾
         * @return          : 返回替换后的字符串
         */
        Tools.prototype.rtrim = function (val, commer, flag) {
            if (commer) {
                var re;
                if (!flag)
                    re = new RegExp('^(\\' + commer + ')*|(\\' + commer + ')*$', 'gi');
                else
                    re = new RegExp('\\' + commer + '*', 'gi');
                return val.replace(re, '');
            }
            else {
                return this.trim(val);
            }
        };
        /**
         * Function 判断数组是否存在某元素  存在： 返回该元素索引； 不存在： 返回 -1
         * @param array
         * @param obj
         * @return {*}
         */
        Tools.prototype.indexOf = function (array, obj) {
            if (array.indexOf)
                return array.indexOf(obj);
            for (var i = 0; i < array.length; i++) {
                if (obj === array[i])
                    return i;
            }
            return -1;
        };
        /**
         * 从数组中删除指定的元素, 返回被指定的元素（ 执行后原数值array将移除指定的元素 ）
         * @param array
         * @param val
         * @return {*}
         */
        Tools.prototype.arrRemove = function (array, val) {
            var index = this.indexOf(array, val);
            if (index >= 0)
                array.splice(index, 1);
            return val;
        };
        /**
         * Function 全角字符转为半角,并去除所有空格
         * @param str
         * @return {String}
         * @constructor
         */
        Tools.prototype.F2C = function (str) {
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
        };
        /**
         * Function 格式化小于10的值
         * @param n
         * @return {String}
         */
        Tools.prototype.dateFm = function (n) {
            return (n < 10) ? '0' + n : n;
        };
        /**
         * Function 将指定时间戳转为： yyyy-mm-dd hh:ii:ss
         * @param timestamp
         * @return {String}
         */
        Tools.prototype.setDateFormat = function (timestamp, format, prefix) {
            if (this._v.isEmpty(timestamp))
                return '';
            var self = this;
            var date = new Date(parseInt(timestamp, 10)), ds = [], ts = [];
            if (!format)
                return date.getFullYear() + '-' + this.dateFm(date.getMonth() + 1) + '-' + this.dateFm(date.getDate()) + ' ' + this.dateFm(date.getHours()) + ':' + this.dateFm(date.getMinutes()) + ':' + this.dateFm(date.getSeconds());
            var cs = format.match(/[^\w\d\s]+?/i), c1 = cs[0] || '-', c2 = cs[1] || ':';
            if (/y+?/i.test(format))
                push(date.getFullYear(), ds);
            if (/m+?/i.test(format))
                push(date.getMonth() + 1, ds);
            if (/d+?/i.test(format))
                push(date.getDate(), ds);
            if (/h+?/i.test(format))
                push(date.getHours(), ts);
            if (/i+?/i.test(format))
                push(date.getMinutes(), ts);
            if (/s+?/i.test(format))
                push(date.getSeconds(), ts);
            function push(value, toAr) {
                toAr.push(prefix ? self.dateFm(value) : value);
            }
            return this.trim(ds.join(c1) + (ts.length > 0 ? ' ' + ts.join(c2) : ''));
        };
        /**
         * Function 比较两个时间差 格式：YYYY-mm-dd
         * @param DateOne
         * @param DateTwo
         * @return {Number}
         */
        Tools.prototype.daysBetween = function (DateOne, DateTwo, callback) {
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
            }
            else {
                //return Math.abs(CDays);
                return CDays;
            }
        };
        /**
         * Function 获取指定参数或者所有参数列表
         * @param name
         * @returns {*}
         */
        Tools.prototype.params = function (name, url) {
            if (this._pars && this._pars[name])
                return this._pars[name];
            //var search: string = (url ? url.split('?')[1] : location.search || location.href.split('?')[1]).replace(/^\?/, '');
            var search = '';
            if (!this._v.isEmpty(url)) {
                search = url.split('?')[1] || '';
            }
            else {
                search = window.location.search.substr(1);
            }
            if (this._v.isEmpty(search))
                return {};
            var mas = search.replace(/^\?/, '').split('&');
            if (!mas || [] === mas)
                return {};
            var i = 0, len = mas.length, ps = {};
            for (; i < len; ++i) {
                //a=b | a=
                var ma = mas[i].split('=');
                if (!ma[0] || '' === ma[0])
                    continue;
                Object.defineProperty(ps, ma[0], {
                    value: decodeURI(ma[1]) || null,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            this._pars = ps;
            return (!name ? ps : decodeURI(ps[name]));
        };
        //获取get模式下url中的指定参数值
        Tools.prototype.getParams = function (name, url) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'), search;
            //var r = (url && url.split('?')[1] || window.location.search.substr(1)).match(reg);
            if (!this._v.isEmpty(url)) {
                search = (url.split('?')[1] || '').match(reg);
            }
            else {
                search = window.location.search.substr(1).match(reg);
            }
            if (search) {
                return decodeURI(search[2]);
            }
            return null;
        };
        //格式化参数 flag: 表示前面是否加上‘?’返回，true: 加上；false: 不加(默认)
        Tools.prototype.paramData = function (object, flag) {
            if (this._v.isEmpty(object) || !this._v.isObject(object))
                return '';
            var data = object, s = '';
            for (var k in data)
                (s += '&' + k + '=' + encodeURI(data[k]));
            s = s.substr(1);
            return (flag === true) ? '?' + s : s;
        };
        /**
         * Function 浏览器 cookie操作
         * @param key       键名
         * @param value     键值
         * @param options   附件选项
         * @returns {*}
         * @constructor
         */
        Tools.prototype.Cookie = function (key, value, options) {
            if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                options = options || {};
                if (value === null || value === undefined) {
                    options.expires = -1;
                }
                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
                value = String(value);
                return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
            }
            options = value || {};
            var decode = options.raw ? function (s) {
                return s;
            } : decodeURIComponent;
            var pairs = document.cookie.split('; ');
            for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
                if (decode(pair[0]) === key)
                    return decode(pair[1] || '');
            }
            return null;
        };
        Tools.prototype.render = function (content, data) {
            var template = YT.Template.getInstance(content, data);
            return template.Render(content, data);
        };
        return Tools;
    })();
    YT.Tools = Tools;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Ajax = (function () {
        function Ajax(options) {
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            this.setting = {
                dataType: 'json',
                type: 'POST',
                async: true,
                timeout: 5000,
                crossDomain: true,
                header: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            };
            this.setting = ST.extend(options, this.setting);
            this.xhr = new XMLHttpRequest();
        }
        //callback ajax finish
        Ajax.prototype._format = function (text, type) {
            var res = text;
            if ('json' === type) {
                try {
                    res = JSON.parse(text);
                }
                catch (e) { }
            }
            else if ('text' === type) {
                try {
                    res = JSON.stringify(text);
                }
                catch (e) { }
            }
            return res;
        };
        Ajax.prototype._callFunction = function (text, type, cb) {
            var res = this._format(text, type);
            this._v.isFunction(cb) && cb(res);
        };
        Ajax.prototype._callComplate = function (xhr, type, cb) {
            this._v.isFunction(cb) && cb(this._format(xhr.responseText, type), xhr);
        };
        /**
         * Ajax Method
         * @param options
         * options use exp: {
         *      url: '/list',
         *      data: { id: 2},
         *      type: 'GET',
         *      dataType: 'json',
         *      ajaxBefore: function(){},
         *      success: function(res){},
         *      error: function(err){},
         *      complate: function(res){}
         * }
             */
        Ajax.prototype.request = function (options) {
            var _this = this;
            var defs;
            if (options && this._v.isObject(options)) {
                defs = ST.extend(options, this.setting);
            }
            if (this._v.isEmpty(defs['url']))
                return;
            var data = defs['data'], dataType = defs['dataType'], type = defs['type'], url = type.toUpperCase() === 'GET' ? defs['url'].split('?')[0] + this._t.paramData(defs['data'], true) : defs['url'], body = type.toUpperCase() === 'GET' ? undefined : data, header = defs['header'], async = 'async' in defs ? defs['async'] : true;
            //open before 请求之前
            this._callFunction(undefined, dataType, defs['ajaxBefore']);
            this.xhr.open(type, url, async);
            for (var k in header) {
                this.xhr.setRequestHeader(k, header[k]);
            }
            this.xhr.onreadystatechange = function () {
                if (_this.xhr.readyState === 4) {
                    _this.xhr.onreadystatechange = null;
                    if (_this.xhr.status === 200) {
                        _this._callFunction(_this.xhr.responseText, dataType, defs['success']);
                    }
                    else {
                        _this._callFunction(_this.xhr, dataType, defs['error']);
                    }
                    _this._callComplate(_this.xhr, dataType, defs['complate']);
                }
            };
            this.xhr.send(body);
        };
        return Ajax;
    })();
    YT.Ajax = Ajax;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/12/8.
 */
var YT;
(function (YT) {
    var PENDING = 1, FULFILLED = 2, REJECTED = 3;
    var Promise = (function () {
        function Promise(fulfil, reject) {
            this.state = PENDING;
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            this._fulfils = [];
            this._rejecteds = [];
            this._bunchFulfil = false;
            this._bunchReject = false;
            this.args = [];
            this.errs = [];
            this.data = null;
            this.then(fulfil, reject);
        }
        Promise.prototype.then = function (fulfil, reject) {
            //this.STATE = 'pending';
            if (this.state === PENDING) {
                fulfil && this._v.isFunction(fulfil) && this._fulfils.push(fulfil);
                reject && this._v.isFunction(reject) && this._rejecteds.push(reject);
            }
            else if (this.state === FULFILLED) {
                this.resolve();
            }
            else if (this.state === REJECTED) {
                this.reject();
            }
            return this;
        };
        /**
         * 将 fulfilled状态的回调 加入到执行队列中
         * @param fulfil
         * @returns {*}
         */
        Promise.prototype.done = function (fulfil) {
            return this.then(fulfil);
        };
        Promise.prototype.success = function (fulfil) {
            return this.then(fulfil);
        };
        //将 rejected状态的回调 加入到执行队列中
        Promise.prototype.catch = function (reject) {
            return this.then(null, reject);
        };
        Promise.prototype.error = function (reject) {
            return this.then(null, reject);
        };
        Promise.prototype.resolve = function (value, bunch) {
            this.state = FULFILLED;
            if (value) {
                this.data = value;
                this.args.push(value);
            }
            this._bunchFulfil = bunch !== false ? this._bunchFulfil : bunch;
            //从多列中取出当前为 FULFILLED状态的回调
            var fulfil = this._fulfils.shift();
            if (fulfil && typeof fulfil === 'function') {
                //如果是指定为 bunch（串行）,使用all调用的
                if (this._bunchFulfil) {
                    this._fulfils.push(fulfil);
                }
                else {
                    this._bunchFulfil = false;
                    fulfil.apply(this, this.args);
                }
            }
            else {
                throw new TypeError('no found a function object to [then|all|done|success]');
            }
        };
        Promise.prototype.reject = function (err, bunch) {
            this.state = REJECTED;
            err && this.errs.push(err);
            this._bunchReject = bunch !== false ? this._bunchReject : bunch;
            //从多列中取出当前为 REJECTED状态的回调
            var reject = this._rejecteds.shift();
            if (reject && typeof reject === 'function') {
                //如果是指定为 bunch（串行）,使用all调用的
                if (this._bunchReject) {
                    this._rejecteds.push(reject);
                }
                else {
                    this._bunchReject = false;
                    reject.apply(this, this.errs);
                }
            }
            else {
                throw new TypeError('no found a function object to [then|catch|error]');
            }
        };
        /**
         * 串行，依次执行队列中的函数，用一个统一的回调进行处理
         * 回调中的参数依据队列进行排列
         * 注意：在最后一个调用resolve之前，必须对bunch进行确认 promise.resolve(value, bunch=true)
         * @param iterable 数组  执行队列
         * @returns {SYST.Promise}
         * exp:  promise.all([func1, func2, func3]).done(function(v1, v2, v3){ }).cache(function(e1, e2, e3){ });
         */
        Promise.prototype.all = function (iterable) {
            var _this = this;
            if (!this._v.isArray(iterable)) {
                throw new TypeError('args me be a array, queue element is be function');
            }
            this._bunchFulfil = true;
            this._bunchReject = true;
            this._t.each(iterable, function (item) {
                _this._t.isFunction(item) && item();
            });
            return this;
        };
        return Promise;
    })();
    YT.Promise = Promise;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Template = (function () {
        function Template(content, data) {
            this.tplConfig = { open: '<%', close: '%>' };
            this.cache = {};
            this.trimSpaceRegx = /^\s*|\s*$/i;
            this.regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
            this.content = content;
            this.data = data;
            this.Render(content, data);
        }
        Template.getInstance = function (content, data) {
            if (!this._instance)
                return new YT.Template(content, data);
            else
                return this._instance;
        };
        Template.prototype._render = function (tpl, data) {
            var self = this;
            var outIndex = 0, ms, conf = this.tplConfig, reg = new RegExp(conf.open + '([^' + conf.close + ']+)?' + conf.close, 'g'), // /<%([^%>]+)?%>/g,
            code = 'var r = [];\n';
            //添加字符串
            var make = function (line, js) {
                js ? (code += line.match(self.regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return make;
            };
            while (ms = reg.exec(tpl)) {
                make(tpl.slice(outIndex, ms.index))(ms[1], true);
                outIndex = ms.index + ms[0].length;
            }
            make(tpl.substr(outIndex, tpl.length - outIndex));
            code += 'return r.join("");';
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
        };
        /**
         * 提供外部接口
         * @param content   元素id或者是模板字符串
         * @param data      渲染需要的数据
         * @returns {*}
         * @constructor
         */
        Template.prototype.Render = function (content, data) {
            if (!content)
                return '';
            var content = content || this.content, data = data || this.data;
            var elm = document.querySelector('#' + content.replace('#', '')), tpl = '';
            if (elm) {
                var tplStr = /^(TEXTEREA|INPUT)$/i.test(elm.nodeName) ? elm.value : elm.innerHTML;
                tpl = tplStr.replace(this.trimSpaceRegx, '');
                try {
                    this.cache[content] = this._render(tpl, data);
                }
                catch (e) {
                    delete this.cache[content];
                }
            }
            else {
                tpl = content.replace(this.trimSpaceRegx, '');
            }
            return this.cache[content] ? this.cache[content] : this._render(tpl, data);
        };
        return Template;
    })();
    YT.Template = Template;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Event = (function () {
        function Event() {
            this.hoadEvent = ST.hoadEvent;
            this.trigger = 'body';
            this.type = 'on';
        }
        /**
         * 事件侦听
         * @param obj   当前对象
         * @param pobj  父对象
         * @param evt   事件名
         * @param func  事件回调
         * @param type  类型 on: 侦听; off: 卸载
         * @param trigger   代理元素
         */
        Event.prototype.initEvent = function (obj, pobj, evt, func, type, trigger) {
            this.self = this;
            this.obj = obj;
            this.pobj = pobj;
            this.evt = evt;
            this.func = func;
            this.type = type || this.type;
            this.trigger = trigger || this.trigger;
            var evts = YT.Event.evts;
            if (this.type === 'off') {
                this.uninitEvent(obj.selector, evt, func);
            }
            //对象事件侦听
            for (var i = 0; i < evts.length; i++) {
                if (evts[i] === evt) {
                    if (obj.selector == 'window') {
                        (type == 'on')
                            ? $(window).off().on(evt, this.hoadEvent(pobj, func))
                            : $(window).off();
                    }
                    else if (obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body') {
                        (type == 'on')
                            ? $(obj.selector).off().on(evt, this.hoadEvent(pobj, func))
                            : $(obj.selector).off();
                    }
                    else {
                        (type == 'on')
                            ? $(this.trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func))
                                .delegate(obj.selector, evt, this.hoadEvent(pobj, func))
                            : $(this.trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func));
                    }
                }
            }
        };
        /**
         * 卸载事件
         * @param selector  元素
         * @param event     事件名
         * @param func      事件回调
         */
        Event.prototype.uninitEvent = function (selector, event, func) {
            if (selector == 'window') {
                $(window).off(event, func);
            }
            else if (selector == 'document' || selector == 'html' || selector == 'body') {
                $(selector).off(event, func);
            }
            else {
                $(this.trigger).undelegate(selector, event, func);
            }
        };
        Event.evts = 'abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting cut copy paste'.split(/\s+/gi);
        return Event;
    })();
    YT.Event = Event;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Model = (function () {
        function Model(child) {
            this.isInit = true;
            this._attributes = {};
            /**
             * Function 通用AJAX请求方法
             * @param url
             * @param postData
             * @param su
             * @param fail
             */
            this.ajaxDataType = 'json';
            this.ajaxType = 'POST';
            this.ajaxBefore = function () { };
            this.ajaxSuccess = function () { };
            this.ajaxError = function () { };
            this.ajaxComplete = function () { };
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            this.ajax = new YT.Ajax();
            this._v = new YT.Validate();
            this.__Name__ = 'SYST Model';
            if (this.isInit)
                this.init();
        }
        Model.prototype.init = function () {
            //console.log('...model init...');
        };
        Model.prototype.set = function (key, value) {
            if (this._v.isEmpty(key))
                return this;
            if (typeof key === 'object') {
                // this.set({ name: 'Rodey', age: 25 });
                for (var k in key) {
                    this._attributes[k] = key[k];
                }
            }
            else if (typeof key === 'string' && key.length > 0) {
                //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                this._attributes[key] = value;
            }
            else {
                return this;
            }
        };
        Model.prototype.get = function (key) {
            return this._attributes[key];
        };
        // 在localStorage中存取
        Model.prototype.getItem = function (key, flag) {
            var item = (!flag ? window.localStorage : window.sessionStorage).getItem(key);
            try {
                item = JSON.parse(item);
            }
            catch (e) { }
            return item;
        };
        Model.prototype.setItem = function (key, value, flag) {
            if (this._v.isObject(key)) {
                // ({ name: 'Rodey', age: 25, phone: { name: 'iphone 5s', prize: 5000 } });
                for (var k in key) {
                    _set(k, key[k]);
                }
            }
            else if (typeof key === 'string' && key.length > 0) {
                // ('name', 'Rodey') || ('one', { name: 'Rodey', age: 25, isBoss: false });
                _set(key, value);
            }
            else {
                return this;
            }
            function _set(_k, _v) {
                if (this._v.isObject(_v)) {
                    _v = JSON.stringify(_v);
                }
                (!flag ? window.localStorage : window.sessionStorage).setItem(_k, _v);
            }
        };
        //判断某个属性是否存在
        Model.prototype.has = function (key) {
            return Boolean(this._attributes[key]);
        };
        Model.prototype.hasItem = function (key, flag) {
            return Boolean((!flag ? window.localStorage : window.sessionStorage).getItem(key));
        };
        //动态添加属性
        Model.prototype.add = function (key, value) {
            this.set(key, value);
        };
        /*public addItem(key, value, options){ this.setItem(key, value, options) },*/
        //动态删除属性
        Model.prototype.remove = function (key) {
            if (!key || key == '')
                return this;
            this._attributes[key] = null;
            delete this._attributes[key];
        };
        Model.prototype.removeItem = function (key, flag) {
            (!flag ? window.localStorage : window.sessionStorage).removeItem(key);
        };
        Model.prototype.removeAll = function (flag) {
            flag ? (this._attributes = []) : (function () { window.localStorage.clear(); window.sessionStorage.clear(); })();
        };
        Model.prototype._getName = function () {
            return this.__Name__;
        };
        Model.prototype.doRequest = function (url, postData, su, fail, options) {
            var self = this, type, dataType, setting = {};
            if (!postData || typeof postData !== 'object' || !url || url == '')
                return;
            if (options && this._v.isObject(options)) {
                type = options.type;
                dataType = options.dataType || this.ajaxDataType;
                setting = options;
            }
            else {
                type = this.ajaxType || 'POST';
                dataType = this.ajaxDataType || 'json';
            }
            //提交前触犯
            (this.ajaxBefore && this._v.isFunction(this.ajaxBefore)) && (setting['beforeSend'] = this.ajaxBefore.apply(self));
            var ajaxSetting = ST.extend(setting, {
                url: url,
                type: type,
                data: postData,
                dataType: dataType,
                success: function (res) {
                    //console.log('请求成功', res);
                    (self.ajaxSuccess && this._v.isFunction(self.ajaxSuccess)) && self.ajaxSuccess.call(self, res);
                    (su && this._v.isFunction(su)) && su.call(self, res);
                },
                error: function (xhr, errType) {
                    //console.log('请求失败');
                    var response = xhr.response;
                    try {
                        response = JSON.parse(response);
                    }
                    catch (e) { }
                    (self.ajaxError && this._v.isFunction(self.ajaxError)) && self.ajaxError.call(self, response, xhr, errType);
                    (fail && this._v.isFunction(fail)) && fail.call(self, response, xhr, errType);
                },
                complete: function (res) {
                    //console.log('请求完成');gulp
                    (self.ajaxComplete && this._v.isFunction(self.ajaxComplete)) && self.ajaxComplete.call(self, res);
                }
            });
            if (window['$']) {
                window['$'].ajax(ajaxSetting);
            }
            else {
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        };
        /**
         * Function doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        Model.prototype.doAjax = function (url, postData, su, fail, options) {
            this.doRequest(url, postData, su, fail, options);
        };
        return Model;
    })();
    YT.Model = Model;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var ShareModel = (function () {
        function ShareModel() {
            if (window['SYST']) {
                window['SYST']['_shareModels'] = {};
            }
        }
        ShareModel.getInstance = function () {
            if (!this._instance) {
                return new ShareModel();
            }
            return this._instance;
        };
        ShareModel.prototype.add = function (key, model) {
            window['SYST']['_shareModels'][key] = model;
        };
        ShareModel.prototype.get = function (key) {
            var shareModels = window['SYST']['_shareModels'];
            if (null == key) {
                return shareModels;
            }
            if (shareModels[key] && shareModels[key] instanceof YT.Model) {
                return shareModels[key];
            }
            return null;
        };
        ShareModel.prototype.remove = function (key) {
            var shareModels = window['SYST']['_shareModels'];
            var model = shareModels[key];
            if (model && model instanceof (YT.Model)) {
                shareModels[key] = null;
                delete shareModels[key];
            }
            return model;
        };
        ShareModel.prototype.has = function (key) {
            var shareModels = window['SYST']['_shareModels'];
            return shareModels[key];
        };
        return ShareModel;
    })();
    YT.ShareModel = ShareModel;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/21.
 */
var YT;
(function (YT) {
    var View = (function () {
        function View(child) {
            this.isInit = true;
            this.unInit = false;
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            this.$el = {};
            this.tagPanel = '';
            this.triggerContainer = 'body';
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            this._e = new YT.Event();
            this._type = 'on';
            !this.unInit && this._initialize();
        }
        View.getInstance = function (child) {
            if (this._self)
                return this._self;
            return new YT.View(child);
        };
        View.prototype._initialize = function () {
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.isInit && this.init && this.init.apply(this, arguments);
            if (this.render) {
                var panel = '<' + this.tagPanel + '/>';
                this.$el = $ ? $(panel) : this.parseDom('', panel);
                this.render.apply(this, arguments);
            }
            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && this._v.isObject(this.events) && this.onEvent();
        };
        View.prototype.init = function () {
            console.log('...View init...');
        };
        View.prototype.render = function () {
        };
        View.prototype.parseDom = function (htmlStr, tagPanel) {
            return this._t.template(htmlStr, tagPanel);
        };
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        View.prototype.parseEvent = function (evtObj) {
            if (!evtObj || evtObj.length == 0 || evtObj === {})
                return this;
            var evts = [], objs = [], handleFunctions = [];
            for (var evt in evtObj) {
                var eobj = evtObj[evt];
                if (this._v.isObject(eobj)) {
                    for (var k in eobj) {
                        var o = this.parseString(eobj, k), selector = o[0], evtType = o[1], func = o[2];
                        pushs(selector, evtType, func);
                    }
                }
                else {
                    var o = this.parseString(evtObj, evt), selector = o[0], evtType = o[1], func = o[2];
                    pushs(selector, evtType, func);
                }
            }
            function pushs(selector, evtType, func) {
                objs.push(selector);
                evts.push(evtType);
                handleFunctions.push(func);
            }
            //储存事件名称
            //this.evts = evts;
            //储存事件侦听对象
            //this.objs = objs;
            //储存事件函数
            //this.handleFunctions = handleFunctions;
            return { events: evts, elements: objs, functions: handleFunctions };
        };
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        View.prototype.autoHandleEvent = function (type) {
            var parseEvents = this.parseEvent(this.events), evts = parseEvents['events'], objs = parseEvents['elements'], funs = parseEvents['functions'];
            if (!evts || evts.length == 0 || evts.length == {})
                return this;
            var type = type || this._type;
            for (var i = 0, l = evts.length; i < l; i++) {
                if (!evts[i])
                    throw new Error('对象侦听' + evts[i] + '不存在');
                if (!funs[i])
                    throw new Error('对象' + this + '不存在' + funs[i] + '方法');
                if (!objs[i])
                    throw new Error('事件函数' + funs[i] + '不存在');
                this._e.initEvent($(objs[i]), this, evts[i], funs[i], type, this.triggerContainer);
            }
            return this;
        };
        View.prototype.parseString = function (obj, k) {
            var o = ($.trim(k)).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType = o[0].replace(/^\s*|\s*$/gi, '');
            var func = obj[k];
            return [selector, evtType, func];
        };
        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        View.prototype.handEvent = function (callback, value) {
            var self = this, args = [];
            for (var i = 2; i < arguments.length; i++)
                args.push(arguments[i]);
            return function (e) {
                args.push(value);
                args.push(e);
                callback.apply(self, args);
            };
        };
        View.prototype.destroy = function () {
            this.$el.remove && this.$el.remove();
        };
        View.prototype.onEvent = function (selector, event, func) {
            if (this._v.isEmpty(selector)) {
                this.autoHandleEvent('on');
            }
            else {
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'on', this.triggerContainer);
            }
        };
        View.prototype.offEvent = function (selector, event, func) {
            if (this._v.isEmpty(selector)) {
                this.autoHandleEvent('off');
            }
            else {
                //this._e.uninitEvent(selector, event, func);
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'off', this.triggerContainer);
            }
        };
        View.prototype.getController = function () {
            return this.controller;
        };
        View.prototype.getModel = function () {
            return this.model || this.getController().getModel();
        };
        View.hoadEvent = ST.hoadEvent;
        return View;
    })();
    YT.View = View;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/21.
 */
var YT;
(function (YT) {
    var Controller = (function () {
        function Controller(child) {
            this.isInit = true;
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            if (true === this.isInit) {
                this.init();
            }
        }
        Controller.prototype.init = function () {
            console.log('...Controller init...');
        };
        Controller.prototype.getModel = function () {
            return this.model;
        };
        Controller.prototype.setModel = function (m) {
            this.model = m;
        };
        return Controller;
    })();
    YT.Controller = Controller;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Router = (function () {
        function Router() {
            this.uri = window.location;
            this._cache = {};
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            for (var k in this.uri) {
                if (this.uri.hasOwnProperty(k)) {
                    this[k] = this.uri[k];
                }
            }
        }
        Router.prototype._getRouteKey = function (hash) {
            return hash.replace(/[#!]/gi, '').split('?')[0];
        };
        Router.prototype.start = function () {
            this.params = this._t.params();
            var hash = this['hash'];
            //如果初始化带有hash
            if (hash && '' !== hash) {
                var currentRoute = this._getRouteKey(hash);
                this._exec(currentRoute);
            }
            this._change();
            return this;
        };
        Router.prototype.when = function (route, object) {
            if (this._v.isObject(object)) {
                this._cache[route] = object;
            }
            else if (this._v.isFunction(object)) {
                this._cache[route] = object();
            }
        };
        Router.prototype.switch = function (route) {
            var self = this;
            if (!this._cache || {} === this._cache)
                return;
            this.params = this._t.params();
            this._exec(route);
            return this;
        };
        /**
         * 执行
         * @param route
         */
        Router.prototype._exec = function (route) {
            this._execRouter(route);
        };
        Router.prototype._execRouter = function (route) {
            var self = this;
            var routeOption = this._cache[route];
            if (!routeOption)
                return;
            if (routeOption.template) {
                this._template(routeOption.template, routeOption.container, function (htmlStr) {
                    //console.log(htmlStr);
                    //console.log(this);
                    self._execMAction(routeOption, htmlStr);
                });
            }
            else {
                self._execMAction(routeOption);
            }
        };
        Router.prototype._execMAction = function (routeOption, tpl) {
            this.tpl = tpl;
            var vadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this }, cadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this, view: routeOption.view };
            //转换成SYST.Model
            this._syst = new ST();
            routeOption.model && (function () { return this._syst.Model(routeOption.model); })();
            routeOption.view && (function () { return this._syst.View(ST.extend(routeOption.view, vadding)); })();
            routeOption.controller && (function () { return this._syst.Controller(ST.extend(routeOption.controller, cadding)); })();
            routeOption.action && this._v.isFunction(routeOption.action) && routeOption.action.call(this, routeOption.model, tpl);
        };
        /**
         * 开始监听路由变化
         * @param callback
         * @private
         */
        Router.prototype._change = function () {
            var self = this;
            window.removeEventListener('hashchange', _hashChangeHandler, false);
            window.addEventListener('hashchange', _hashChangeHandler, false);
            function _hashChangeHandler(evt) {
                self.oldURL = '#' + evt.oldURL.split('#')[1];
                self.newURL = '#' + evt.newURL.split('#')[1];
                var currentRoute = self._getRouteKey(self.newURL);
                self.switch(currentRoute);
            }
        };
        //解释html
        Router.prototype._template = function (html, cid, callback) {
            var self = this;
            var container = window['$']('#' + cid.replace(/#/gi, ''));
            if (/<|>/.test(html)) {
                container.html(html);
                callback && this._v.isFunction(callback) && callback.call(self, html);
            }
            else {
                container.load(html, function (res) {
                    callback && this._v.isFunction(callback) && callback.call(self, res);
                }, function (err) {
                    throw new Error('load template is failed!');
                });
            }
        };
        return Router;
    })();
    YT.Router = Router;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Native = (function () {
        function Native() {
        }
        return Native;
    })();
    YT.Native = Native;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/12/17.
 */
window['SYST'] = new ST();
