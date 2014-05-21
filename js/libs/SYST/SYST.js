/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-1-17
 * Time: 下午1:06
 * To change this template use File | Settings | File Templates.
 * 此框架依赖于: jQuery || Zepto || Ender   依赖于模板插件: Arttemplate || Underscore
 * 使用前请先引入依赖插件
 *
 * requireJS 引入:
 *                  'SYST' : {
                        deps : ['jQuery', 'arttemplate'],
                        exports: 'SYST'
                    }
 */

;(function(SYST){

    'use strict';

    var root = this;
    var SYST = {};
    (typeof exports !== 'undefined') ? (SYST = exports) : (SYST = root.SYST = {});

    //框架属性
    SYST.version = '0.5';
    SYST.author = 'Rodey Luo';
    SYST.createDate = '2014-01-17';
    SYST.updateDate = '2014-03-28';
    SYST.name = 'SYST JS MVC Framework (JS MVC框架)';
    /**
     * Native相关
     * @type {String}
     */
    var ua = navigator.userAgent.toUpperCase();
    // 当前环境是否为Android平台
    SYST.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // 当前环境是否为IOS平台
    SYST.IS_IOS = ua.indexOf('IPHONE OS') != -1;
    // 当前环境是否为本地Native环境
    SYST.IS_NATIVE = (SYST.IS_ANDROID || SYST.IS_IOS) ? true : false;

    //解决命名冲突
    SYST.noConflict = function() {
        root.SYST = SYST;
        return this;
    };
    //外置插件 (加载时一定要考虑依赖性)
    //var template = root.template || root._ || undefined;
    //if (!$ && (typeof require !== 'undefined')) $ = require(['jQuery']) || require(['Zepto']) || require(['ender']);
    //if (!template && (typeof require !== 'undefined')) template = require(['arttemplate']) || require(['underscore']);
    //判断是否有jquery，zepto插件
    try{
        SYST.$ = root.jQuery || root.Zepto || root.ender || undefined;
    }catch(e){
        throw new Error('$不存在，请先引入jQuery|Zepto|Ender插件，依赖其中一个。' + e);
    };
    //模板引擎插件，默认使用arttemplate ( https://github.com/aui/artTemplate || www.planeart.cn/?tag=arttemplate )
    //也支持underscore（ _ ）
    try{
        SYST.template = root.template || root._ || undefined;
    }catch(e){
        throw new Error('模板解析对象不存在，请先引入arttemplate|underscore插件，依赖其中一个。' + e);
    };

    /**
     * 继承函数
     * @param parent 父对象
     * @param child  子对象
     * @return {*}
     * @private
     */
    SYST._extend = function(parent, child){
        if(!parent) return child;
        if(!child) return parent;
        //var child = child;
        if(!child.prototype){
            child.__super__ = parent.prototype;
            for(var proto in parent.prototype){
                child[proto] = parent.prototype[proto];
            }
        }
        return child;
    };

    /**
     * Model 模型对象
     * @type {Function}
     */
    var Model = SYST.Model = function(child){
        this.__Name__ = 'Model';
        if(child){
            child = child || {};
            child.__SuperName__ = 'SYST Model';
            child = SYST._extend(SYST.Model, child);
            child._initialize();
            return child;
        }else{
            return new SYST.Model({});
        }
    };
    SYST.Model.prototype = {
        _initialize: function(){
            this.init && this.init.apply(this, arguments);
            this.attributes = {};
        },
        get: function(key){
            return this.attributes[key];
        },
        set: function(key, value, options){
            if(key == null) return this;
            var attrs, options;
            if(key && key.length > 0){
                if(typeof key === 'object'){
                    // this.set({ name: 'Rodey', age: 25 });
                    for(var k in key){
                        this.attributes[k] = key[k];
                    }
                }else if(typeof key === 'string' && value){
                    //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                    this.attributes[key] = value;
                }else{
                    return this;
                }
            }
        },
        //判断某个属性是否存在
        has: function(key){
            return Boolean(this.attributes[key]);
        },
        //动态添加属性, 如果存在则覆盖
        add: function(object){
            if(!SYST.T.isObject(obj)) return this;
            for(var proto in object){
                this.attributes[proto] = object[proto];
            }
        },
        //动态删除属性
        remove: function(key){
            if(!key || key == '') return this;
            this.attributes[key] = null;
            delete this.attributes[key];
        },
        _getName: function(){
            return this.__Name__;
        },

        change: function(key, callback){
            if(!key || key == '' || key == null || typeof key == 'undefined'){
                throw new Error('change事件中必须有key');
                return this;
            }
            var attributes = this.attributes;
            if(attributes[key]){
                if(typeof callback === 'function'){
                    callback.call(this, arguments);
                }else{
                    console.log(this);
                }
            }
        },

        /**
         * 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doRequest: function(url, postData, su, fail, options){
            if(!postData || typeof postData !== 'object' || !url || url == '') return;
            var su = options && options.success ? options.success : su;
            var fail = options && options.error ? options.error : fail;
            var type = options && options.type ? options.type : 'post';
            var dataType = options && options.dataType ? options.dataType : 'json';
            if(root.$){
                root.$.ajax({
                    url: url,
                    type: type,
                    data: postData,
                    dataType: dataType,
                    success: function(res){
                        //console.log(res);
                        if(typeof su === 'function') su.call(this, res);
                    },
                    error: function(xhr, errType){
                        //alert('网络异常，请重试');
                        //console.log('网络异常，请重试');
                        if(typeof fail === 'function') fail.call(this, xhr, errType);
                    }
                });
            }else{
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        },
        /**
         * doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doAjax: function(url, postData, su, fail, options){
            this.doRequest(url, postData, function(res){
                if(typeof su === 'function') su.call(this, res);
            }, function(xhr, errType){
                if(typeof fail === 'function') fail.call(this, xhr, errType);
            }, options);
        }
    };

    /**
     * 共享数据模型
     * @type {Object}
     */
    var shareModel = SYST.shareModel = {
        _cacheList: {},
        add: function(key, val){
            SYST.shareModels[key] = val;
        },
        get: function(key){
            return SYST.shareModels[key];
        },
        remove: function(key){
            SYST.shareModels[key] = null;
            delete SYST.shareModels[key];
        }
    };

    /**
     * 控制器对象
     * @type {Function}
     */
    var Controller = SYST.Controller = function(child){
        this.__Name__ = 'Controller';
        this.model = undefined;
        this.shareModels = {};
        this.validate = {};
        if(child){
            child.__SuperName__ = 'SYST Controller';
            child = SYST._extend(SYST.Controller, child);
            child._initialize();
            return child;
        }else{
            return new SYST.Controller({});
        }
    };
    SYST.Controller.prototype = {
        defaultHost: location.host,
        shareModels: {},
        _initialize: function(){
            this.init && this.init.apply(this, arguments);
            this.validate = SYST.V;
        },
        getModel: function(key){
            if(key)
                return this.shareModels[key];
            else
                return this.model;
        },
        setModel: function(key, val){
            if(key !== '' || typeof key === 'string'){
                this.shareModels[key] = val;
            }else if(typeof key === 'object'){
                this.model = key;
            }else{
                throw 'setModel: 参数有误';
            }
        },
        shareModel: SYST.shareModel
    };

    /**
     * 事件处理（ 事件绑定 ）
     * @obj     事件侦听对象
     * @pobj    this作用域被替换对象
     * @evt     事件名称
     * @func    事件函数
     * @type {Function}
     */
    var Events = SYST.Events = function(obj, pobj, evt, func){
        var self = this;
        var evts = "abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting".split(/\s+/gi);
        if(!obj) obj = window;
        //重构
        if(window.$ || window.jQuery){
            for(var i = 0; i < evts.length; i++){
                //console.log(evt)
                if(evts[i] === evt){
                    //采用jquery进行绑定
                    //obj.on(evt, hoadEvent(pobj, func));
                    if(obj.selector == 'window')
                        $(window).on(evt, hoadEvent(pobj, func));
                    else if(obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body')
                        $(obj.selector).on(evt, hoadEvent(pobj, func));
                    else
                        $('body').delegate(obj.selector, evt, hoadEvent(pobj, func));
                }else{
                    continue;
                }
            }
        }else{
            throw new Error('请先引入jQuery或者是zepto');
        }
    };

    var hoadEvent = function(obj, func){
        var args = [], self = this;
        obj = obj || window;
        for(var i = 2; i < arguments.length; i++) args.push(argments[i]);
        return function(e){
            if(e && typeof evt === 'object'){
                e.preventDefault();
                e.stopPropagation();
            }
            args.push(e);
            //obj[func].apply(obj, args);
            //保证传递 Event对象过去
            //obj[func].call(obj, e, args);
            obj[func].call(obj, e, args);
        }
    };

    /**
     * 视图对象
     * @type {Function}
     */
    var View = SYST.View = function(child){
        this.__Name__ = 'View';
        this.controller = undefined;
        this.model = undefined;
        this.events = {};
        //this.tagPanel = 'section';
        if(child){
            child.__SuperName__ = 'SYST View';
            child = SYST._extend(SYST.View, child);
            child._initialize();
            return child;
        }else{
            return new SYST.View({});
        }
    };
    SYST.View.prototype = {
        $el: {},
        tagPanel: 'selection',
        _template: '',
        _initialize: function(){

            this.el = {};
            this.chache = [];
            this.els = {};
            this.shareModels = {};

            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            var panel = '<' + this.tagPanel + '/>';
            this.$el = SYST.$ ? SYST.$(panel) : this.parseDom(panel);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.init && this.init.apply(this, arguments);
            this.render && this.render.apply(this, arguments);

            //自动解析 events对象，处理view中的事件绑定
            this.parseEvents(this.events);
            this.autoHandleEvent();

        },
        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        handle: function(callback, value){
            var self = this;
            return function(e){
                callback.apply(self, arguments);
            }
        },
        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        handEvent: function(callback, value){
            var self = this, args = [];
            for(var i = 2; i < arguments.length; i++)   args.push(arguments[i]);
            return function(e){
                args.push(value);
                args.push(e);
                callback.apply(self, args);
            }
        },
        //处理事件绑定，以改变对象作用域
        hoadEvent: function(obj, func){
            var args=[];
            obj = obj || this || window;
            for(var i = 2; i < arguments.length; i++)   args.push(arguments[i]);
            return function(e){
                if(e && typeof evt === 'object'){
                    e.preventDefault();
                    e.stopPropagation();
                }
                args.push(e);
                //obj[func].apply(obj, args);
                //解决同类多个对象侦听后，evt.target值不改变bug
                obj[func].call(obj, e, args);
            }
        },
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        parseEvents: function(evtObj){
            //console.log(evtObj)
            if(!evtObj || evtObj.length == 0 || evtObj === {}) return this;

            var evts = [], objs = [], handleFunctions = [];
            for(var evt in evtObj){
                var o = evt.split(' ');
                objs.push(o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"'));  // $("#one")
                evts.push(o[0].replace(/^\s*|\s*$/gi, ''));
                handleFunctions.push(evtObj[evt]);
            }
            //储存事件名称
            this.evts = evts;
            //储存事件侦听对象
            this.objs = objs;
            //储存事件函数
            this.handleFunctions = handleFunctions;
            /*console.log(this.evts)
             console.log(this.objs)
             console.log(this.handleFunctions)*/
        },
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        autoHandleEvent: function(obj){
            if(!this.evts || this.evts.length == 0 || this.evts.length == {}) return this;
            obj = obj || this;
            for(var i = 0, l = this.evts.length; i < l; i++){
                //console.log(this.evts[i])
                if(!this.evts[i])
                    throw new Error('对象侦听'+ this.evts[i] + '不存在');
                if(!this.handleFunctions[i])
                    throw new Error('对象'+ this + '不存在' + this.handleFunctions[i] + '方法');
                if(!this.objs[i])
                    throw new Error('事件函数'+ this.handleFunctions[i] + '不存在');
                else
                    SYST.Events($(this.objs[i]), this, this.evts[i], this.handleFunctions[i]);
                //console.log(this.handleFunctions[i]);
            }
            return this;
        },
        /**
         * 模板渲染
         * @param htmlStr
         * @param data
         * @return {*}
         */
        template: function(htmlStr, data){
            var compHtml, render;
            if(root.template){  //采用arttemplate编译
                render = SYST.template.compile(htmlStr);
                compHtml = render(data);
                return compHtml
            }else if(root._){  //采用underscore编译
                compHtml = _.template(htmlStr, data);
            }else{             // 如果模板插件不存在，则直接返回jQuery或者浏览器标准对象
                compHtml = SYST.$ ? SYST.$(htmlStr) : this.parseDom(htmlStr);
            }
            return compHtml;
        },
        render: function(){
            return this;
        },
        //将元素转成对象并返回
        parseDom: function(htmlStr, tagPanel){
            return SYST.T._template(htmlStr, tagPanel);
        },
        /**
         * 获取标签元素对象 use: getEl('#id')\getEl('.class')\getEl('tagName');
         * @param selector
         * @param content
         * @return {*}
         */
        getEl: function(selector, content){
            var el;
            if(selector.indexOf('#') !== -1 && selector.indexOf('#') === 0){
                el = document.getElementById(selector.substring(1));
            }else if(selector.indexOf('.') !== -1 && selector.indexOf('.') === 0){
                el = document.getElementsByClassName(selector.substring(1));
            }else{
                el = document.getElementsByTagName(selector.replace(/^[^a-zA-Z]*/gi, ''));
            }
            this.els.el = el;
            return el;
        },
        getController: function(){
            return this.controller ? this.controller : SYST.Controller;
        },
        getModel: function(){
            return this.model ? this.model : SYST.Model;
        },
        shareModel: SYST.shareModels
    };

    /**
     * web通用验证数据对象
     * @type {Function}
     */
    var Validate = SYST.Validate = function(child){
        this.__Name__ = 'Validate';
        if(child){
            child.__SuperName__ = 'SYST Validate';
            child = SYST._extend(SYST.Validate, child);
            return child;
        }else{
            return new SYST.Validate({});
        }
    };
    SYST.V = SYST.Validate.prototype = {
        //为空时
        isEmpty: function(val){ return (!val || val.length == 0 || val == '' || val == null || typeof val == 'undefined') ? true : false;},
        //是否已设置
        isSet: function(val){ return (val || typeof val != 'undefined') ? true : false; },
        //判断数值是否在两者之间 (默认不包括两者)
        between: function(val, min, max, flag){
            var flag = flag || false;
            return (flag) ? ((val.length >= min && val.length <= max) ? true : false) : ((val.length > min && val.length < max) ? true : false);
        },
        //是否含有中文 （flag存在则完全匹配中文，默认不完全匹配）
        isCN: function(str, flag){
            var flag = flag || false;
            return (!flag) ? (/^[\u4e00-\u9fa5]+$/i.test(str)) : (/[\u4e00-\u9fa5]+/gi.test(str));
        },
        //验证 E-mail 地址
        isEmail: function(email){ return /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(email); },
        //验证 URL 地址
        isURL: function(url){ return /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url); },
        //验证电话号码
        isTel: function(tel){ return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/gi.test(tel); },
        //验证手机号码
        isMobile: function(mobile){ return /^1[3|5|8]{1}\d{9}$/.test(mobile); },
        //验证邮编
        isZip: function(zipCode){ return /^\d{6}$/.test(zipCode); },
        //验证日期, 日期时间, 时间
        isDateLocal : function(date){ return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(date); },
        isDateTime  : function(dateTime){ return /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(dateTime); },
        isTime      : function(time){ return /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(time); },
        /**
         * 常用对象判断
         * @param value
         * @return {Boolean}
         */
        isString    : function(value){ return typeof value === 'string'; },
        isNumber    : function(value){ return typeof value === 'number'; },
        isArray     : function(value){ return toString.call(value) === '[object Array]'; },
        isDate      : function(value){ return toString.call(value) === '[object Date]'; },
        isObject    : function(value){ return value != null && typeof value === 'object'; },
        isFunction  : function(value){ return toString.call(value) === '[object Function]'; },
        isFile      : function(value){ return toString.call(value) === '[object File]'; },
        isBlob      : function(value){ return toString.call(value) === '[object Blob]'; },
        isBoolean   : function(value){ return typeof value === 'boolean'; },
        isUndefined : function(value){ return typeof value === 'undefined';},
        isdefined   : function(value){ return typeof value !== 'undefined';},
        isRegExp    : function(value){ return toString.call(value) === '[object RegExp]'; },
        isWindow    : function(value){ return value && value.document && value.location && value.alert && value.setInterval; },
        isElement   : function(value){ return !!(value && (value.nodeName || (value.prop && value.attr && value.find))); }
    };

    /**
     * web通用公共函数对象
     * @type {Function}
     */
    var Tools = SYST.Tools = function(child){
        this.__Name__ = 'Tools';
        if(child){
            child.__SuperName__ = 'SYST Tools';
            child = SYST._extend(SYST.Tools, child);
            return child;
        }else{
            return new SYST.Tools({});
        }
    };
    SYST.T = SYST.Tools.prototype = {
        _template: function(htmlStr, tagPanel){
            var element = document.createElement(tagPanel || 'div');
            element.innerHTML = htmlStr;
            //jQuery || zepto
            if($){ element.childNodes = $(htmlStr); }
            return element.childNodes;
        },
        //去除两边空白
        // commer: 指定要取出的字符串
        // flag: true->表示要全文替换； false->只去除字符串首尾
        trim: function(val, commer, flag){
            if(commer){
                var re;
                if(!flag)
                    re = new RegExp('^(' + commer +')*|('+ commer + ')*$', 'i');
                else
                    re = new RegExp('' + commer + '*', 'gi');
                var ma = val.match(re)[0];
                return val.replace(re, '');
            }else{
                return val.replace(/^\s*|\s*$/gi, '');
            }
        },
        /**
         * 去除字符串首尾指定的字符
         * @param val   : 将要进行替换的字符串
         * @param commer: 指定要替换的字符串
         * @return      : 返回替换后的字符串
         */
        rtrim:function(val, commer){
            if(commer){
                var re = new RegExp('^(' + commer +')*|('+ commer + ')*$', 'gi');
                return val.replace(re, '');
            }else{
                return val.replace(/^\s*|\s*$/gi, '');
            }
        },
        /**
         * 计算对象长度
         * @param val
         * @return {*}
         */
        size: function(val){
            var count = 0, key;
            if(SYST.V.isString(val) || SYST.V.isArray(val)){
                return val.length;
            }else if(SYST.V.isObject(val)){
                for(key in val)
                    if(val.hasOwnProperty(key))
                        count++;
            }
            return count;
        },
        /**
         * 判断数组是否存在某元素  存在： 返回该元素索引； 不存在： 返回 -1
         * @param array
         * @param obj
         * @return {*}
         */
        indexOf: function(array, obj) {
            if (array.indexOf) return array.indexOf(obj);
            for (var i = 0; i < array.length; i++) {
                if (obj === array[i]) return i;
            }
            return -1;
        },
        /**
         * 从数组中删除指定的元素, 返回被指定的元素（ 执行后原数值array将移除指定的元素 ）
         * @param array
         * @param val
         * @return {*}
         */
        arrRemove: function(array, val){
            var index = this.indexOf(array, val);
            if (index >=0)
                array.splice(index, 1);
            return val;
        },
        /**
         * 全角字符转为半角,并取出所有空格
         * @param str
         * @return {String}
         * @constructor
         */
        F2C: function(str){
            var s = "", str = str.replace(/\s*/gi, '');
            for(var i = 0; i < str.length; i++){
                var c = str.charCodeAt(i);
                if(c == 12288){
                    s += String.fromCharCode(32);
                    continue;
                }
                if(c > 65280 && c < 65375){
                    s += String.fromCharCode(c - 65248);
                    continue;
                }
                s += String.fromCharCode(c);
            }
            s = s.replace(/\s*/gi, '');
            return s.toUpperCase();
        },
        /**
         * 格式化小于10的值
         * @param n
         * @return {String}
         */
        dateFm: function(n){ return (n < 10) ? '0'+n : n; },
        /**
         * 将指定时间戳转为： yyyy-mm-dd hh:ii:ss
         * @param timestamp
         * @return {String}
         */
        setDateFormat: function(timestamp){
            var date = new Date(parseInt(timestamp));
            return date.getFullYear() +'-'+ this.dateFm(date.getMonth() + 1) +'-'+ this.dateFm(date.getDate()) + ' ' + this.dateFm(date.getHours()) + ':' + this.dateFm(date.getMinutes()) + ':' + this.dateFm(date.getSeconds());
        },
        //获取get模式下url中的指定参数值
        getParams: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if(r) {
                return decodeURI(r[2]);
            }
            return null;
        },
        /**
         * 浏览器 cookie操作
         */
        Cookie: function(key, value, options) {
            if(arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                options = options || {};
                if(value === null || value === undefined) {
                    options.expires = -1;
                }
                if( typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
                value = String(value);
                return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
            }
            options = value || {};
            var decode = options.raw ? function(s) {
                return s;
            } : decodeURIComponent;
            var pairs = document.cookie.split('; ');
            for(var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
                if(decode(pair[0]) === key)
                    return decode(pair[1] || '');
            }
            return null;
        },

        /**
         * 截取字符串长度
         * @param str
         * @param start
         * @param end
         */
        subStr: function(str, start, end){
            if(!SYST.V.isString(str) || str.length == 0){ return ''; }
            var l = str.length;
            var start = start || 0;
            var end = (end || l) > l ? l : (end || l);  // 'Rodeyluo'
            var sa = str.split('');
            var a = [];

            if(start < 0 && end > 0){
                start = Math.abs(start); //-2, 3
                for(var i=l - start; i<l; i++)
                    a.push(str[i]);
                //s = str.substr(str.length - start, str.length);
            }else if(start < 0 && end < 0){
                start = Math.abs(start); //-2
                end = Math.abs(end);  //-4
                for(var i=l - end; i<l - start; i++)
                    a.push(str[i]);
                //s = str.substr(l - end, l - start);
            }else if(start > 0 && end < 0){
                end = Math.abs(end); //0, -2
                for(var i=start; i<l - end; i++)
                    a.push(str[i]);
                //s = str.substr(start, l - end);
            }else if(start > 0 && end > 0){
                for(var i=start; i<end; i++)
                    a.push(str[i]);
                //s = str.substr(start, end);
            }else if(start == 0 && end == 0){
                return '';
            }
            return a.join('');
        },

        /**
         * 截取字符串长度
         * @param str       要截取的字符串
         * @param len       要截取的长度
         * @param commer    结尾补假字符（可选）默认为'...'
         */
        subString: function(str, len, commer){
            if(!SYST.V.isString(str) || str.length == 0){ return ''; }
            if(!len || len == 0){ return ''; }
            var commer = commer || '...';
            var sarr = [];
            var l = str.length;
            if(len > 0){
                for(var i = 0; i < l; i++){
                    if(i > len - 1){
                        continue;
                    }else{
                        sarr.push(str[i]);
                    }
                }
            }else if(len == 0){
                return '';
            }else{
                for(var i = l; i >= l - Math.abs(len); i--)
                    sarr.unshift(str[i]);
            }

            return sarr.join('') + commer;
        }
    };

    /**
     * 移动开发工具（web端调用native）
     * @type {Function}
     */
    var Native = SYST.Native = function(child){
        this.__Name__ = 'Native';
        this.isAndroid = SYST.IS_ANDROID;
        this.isIos = SYST.IS_IOS;
        this.isNative = (SYST.IS_ANDROID || SYST.IS_IOS) ? true : false;
        if(child){
            child.__SuperName__ = 'SYST Native';
            child = SYST._extend(SYST.Native, child);
            return child;
        }else{
            return new SYST.Native({});
        }
    };

    /**
     * USE: //调用native方法 （移动开发）
     * @type {Object}
     *
     * use: var getName = function(id, callback){
     *          if(SYST.N.isNative){
     *              SYST.N.callNative('getName', id, callback);
     *          }else{
     *              var rs = '不是移动web应用'; || '{ "result":"NO","error":"不是移动web应用" }' ----使用时用JSON.parse()
     *              callback(rs);
     *          }
     *      }
     */
    SYST.N = SYST.Native.prototype = {
        isAndroid   : SYST.IS_ANDROID,
        isIos       : SYST.IS_IOS,
        isNative    : SYST.IS_NATIVE,
        callNative  : function(name){  }
    };

    /* native start */
    var _callindex = 0, _toString = Object.prototype.toString;
    // 如果fn是一个函数类型, 则调用
    var _exec = function(fn) {
        if(_toString.call(fn) == '[object Function]') {
            fn();
        }
    };
    /**
     * 调用一个Native方法
     * @param {String} name 方法名称
     */
    SYST.callNative = SYST._call = function(name) {

        // 获取传递给Native方法的参数
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = '', item = null;

        // 遍历参数
        for(var i = 0, len = args.length; i < len; i++) {
            item = args[i];
            if(item === undefined) {
                item = '';
            }

            // 如果参数是一个Function类型, 则将Function存储到window对象, 并将函数名传递给Native
            if(_toString.call(item) == '[object Function]') {
                callback = name + 'Callback' + i;

                root[callback] = item;
                //console.log(root);
                item = callback;
            }
            args[i] = item;
        }



        if(SYST.IS_ANDROID) {// Android平台
            try {
                for(var i = 0, len = args.length; i < len; i++) {
                    // args[i] = '"' + args[i] + '"';
                    args[i] = '\'' + args[i] + '\'';
                }
                //alert('window.android.' + name + '(' + args.join(',') + ')')
                eval('window.android.' + name + '(' + args.join(',') + ')');
            } catch(e) {
                //alert(e.message)
                console.log(e)
            }
            eval();
        } else if(SYST.IS_IOS) {// IOS平台
            if(args.length) {
                args = '|' + args.join('|');
            }
            // IOS通过location.href调用Native方法, _call变量存储一个随机数确保每次调用时URL不一致
            _callindex++;
            console.log(name)
            console.log(args)
            //alert('#ios:' + name + args + '|' + _callindex)
            location.href = '#ios:' + name + args + '|' + _callindex;
        }
    };

    root.hoadEvent = window.hoadEvent =  function(obj, func){
        var args = [], self = this;
        obj = obj || window;
        for(var i = 2; i < arguments.length; i++)  args.push(arguments[i]);
        return function(e){
            if(e && typeof evt === 'object'){
                e.preventDefault();
                e.stopPropagation();
            }
            args.push(e);
            //obj[func].apply(obj, args);
            //解决同类多个对象侦听后，evt.target值不改变bug
            obj[func].call(obj, e, args);
        }
    };

    /**
     * window对象 object子类对象原型扩展 ----------------------------
     */
    /**
     * 返回数值中指定元素的索引值
     * @param val
     * @return {Number}
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    /**
     * 删除数值中指定的元素
     * @param val
     */
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
        return this;
    };



    // RequireJS && SeaJS -----------------------------
    if(typeof define === 'function'){
        define(function() {
            return SYST;
        });
        // NodeJS
    }else if(typeof exports !== 'undefined'){
        module.exports = SYST;
    }else{
        SYST = root.SYST = function(){};
    }

    root.SYST = SYST;


}).call(this);