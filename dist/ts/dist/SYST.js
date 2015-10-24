/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Ajax = (function () {
        function Ajax() {
        }
        return Ajax;
    })();
    YT.Ajax = Ajax;
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
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Event = (function () {
        function Event() {
            this.hoadEvent = SYST.hoadEvent;
            this.trigger = 'body';
            this.type = 'on';
        }
        Event.prototype.initEvent = function (obj, pobj, evt, func, type, trigger) {
            this.self = this;
            this.obj = obj;
            this.pobj = pobj;
            this.evt = evt;
            this.func = func;
            this.type = type || this.type;
            this.trigger = trigger || this.trigger;
            var evts = YT.Event.evts;
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
                            ? $(trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func)).delegate(obj.selector, evt, this.hoadEvent(pobj, func))
                            : $(trigger).undelegate();
                    }
                }
            }
        };
        Event.prototype.uninitEvent = function (selector, event, func) {
            if (selector == 'window') {
                $(window).off(event, func);
            }
            else if (selector == 'document' || selector == 'html' || selector == 'body') {
                (type == 'on');
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
            this._v = new YT.Validate();
            this.__Name__ = 'SYST Model';
            if (this.isInit)
                this.init();
        }
        Model.prototype.init = function () {
            console.log('...model init...');
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
            var ajaxSetting = SYST.extend(setting, {
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
            if (root.$) {
                root.$.ajax(ajaxSetting);
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
    var Native = (function () {
        function Native() {
        }
        return Native;
    })();
    YT.Native = Native;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Router = (function () {
        function Router() {
        }
        return Router;
    })();
    YT.Router = Router;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var ShareModel = (function () {
        function ShareModel() {
        }
        return ShareModel;
    })();
    YT.ShareModel = ShareModel;
})(YT || (YT = {}));
/**
 * Created by Rodey on 2015/10/21.
 */
var SYST = (function () {
    function SYST() {
    }
    SYST.prototype.Model = function (child) {
        this._model = new YT.Model(child);
        return this._model;
    };
    SYST.prototype.View = function (child) {
        /*this._view = new YT.View(child);
        return this._view;*/
        return YT.View.getInstance(child);
    };
    SYST.prototype.Controller = function (child) {
        this._controller = new YT.Controller(child);
        return this._controller;
    };
    SYST.prototype.Event = function () {
        this._event = new YT.Event();
        return this._event;
    };
    SYST.prototype.Validate = function () {
        this._validate = new YT.Validate();
        return this._validate;
    };
    SYST.prototype.Tools = function () {
        this._tools = new YT.Tools();
        return this._tools;
    };
    SYST.noConflict = function () {
        return SYST;
    };
    /**
     * 对象继承
     * @param parent
     * @param child
     * @returns {any}
     */
    SYST.extend = function (parent, child) {
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
    SYST.extendClass = function (d, b) {
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
    SYST.clone = function (targetObject) {
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
    SYST.hoadEvent = function (object, func) {
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
    SYST.author = 'Rodey';
    SYST.version = '0.0.5';
    SYST.name = 'SYST JS MVC mini Framework (JS MVC框架)';
    return SYST;
})();
/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Template = (function () {
        function Template() {
        }
        return Template;
    })();
    YT.Template = Template;
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
            var search = (url ? url.split('?')[1] : location.search || location.href.split('?')[1]).replace(/^\?/, '');
            if (this._v.isEmpty(search))
                return {};
            var mas = search.split('&');
            if (!mas || [] === mas)
                return null;
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
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = (url && url.split('?')[1] || window.location.search.substr(1)).match(reg);
            if (r) {
                return decodeURI(r[2]);
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
        return Tools;
    })();
    YT.Tools = Tools;
})(YT || (YT = {}));
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
        View.hoadEvent = SYST.hoadEvent;
        return View;
    })();
    YT.View = View;
})(YT || (YT = {}));