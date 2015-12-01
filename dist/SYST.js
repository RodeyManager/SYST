/**
 * Created with JetBrains WebStorm.
 * Author: Rodey Luo
 * Date: 15-6-12
 * Time: 下午1:06
 * To change this template use File | Settings | File Templates.
 * 此框架依赖于: jQuery || Zepto || Ender   依赖于模板插件: Arttemplate || Underscore
 * 使用前请先引入依赖插件
 *
 * requireJS 引入:
 *                  'SYST' : {
                        deps : ['jQuery || Zepto || Ender'],
                        exports: 'SYST'
                    }
 */

;(function(SYST){

    'use strict';

    var root = this;
    var SYST = {};
    (typeof exports !== 'undefined') ? (SYST = exports) : (SYST = root.SYST = {});

    //框架属性
    SYST.version = '1.0.0';
    SYST.author = 'Rodey Luo';
    SYST.name = 'SYST JS MVC mini Framework (JS MVC框架)';

    //解决命名冲突
    SYST.noConflict = function() {
        root.SYST = SYST;
        return this;
    };
    //外置插件 (加载时一定要考虑依赖性)
    //判断是否有jquery，zepto插件
    try{
        SYST.$ = root.jQuery || root.Zepto || undefined;
    }catch(e){
        throw new Error('$不存在，请先引入jQuery|Zepto插件，依赖其中一个。' + e);
    }

    /**
     * 继承函数
     * @param parent 父对象
     * @param child  子对象
     * @return {*}
     * @private
     */
    var _extend = function(parent, child){
        if(!parent) return child;
        if(!child) return parent;
        if(!child.prototype){
            child.__super__ = parent;
            var proto;
            for(proto in parent){
                if(parent.hasOwnProperty(proto)){
                    child[proto] = parent[proto];
                }
            }
        }
        return child;
    };

    var _clone = function(targetObject){
        var target = targetObject, out = {}, proto;
        for(proto in target){
            if(target.hasOwnProperty(proto)){
                out[proto] = target[proto];
            }
        }
        return out;
    };

    var _hoadEvent = function(obj, func){
        var args = [], self = this;
        obj = obj || window;
        for(var i = 2; i < arguments.length; i++) args.push(arguments[i]);
        return function(e){
            if(e && typeof e === 'object'){
                e.preventDefault();
                e.stopPropagation();
            }
            args.push(e);
            //obj[func].apply(obj, args);
            //保证传递 Event对象过去
            //obj[func].call(obj, e, args);
            if(obj[func])
                obj[func].call(obj, e, args);
            else
                throw new Error(func + ' 函数未定义！');
        }
    };

    SYST.extend = _extend;
    SYST.clone = _clone;
    SYST.hoadEvent = _hoadEvent;

    // RequireJS && SeaJS -----------------------------
    if(typeof define === 'function'){
        define(function() {
            return SYST;
        });
        // NodeJS
    }else if(typeof exports !== 'undefined'){
        module.exports = SYST;
    }

    root.SYST = SYST;


}).call(this);
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
/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    //需要转移的字符
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };

    /**
     * Module web通用公共函数对象
     * @type {Function}
     */
    var Tools = SYST.Tools = function(child){
        this.__Name__ = 'Tools';
        if(child){
            child.__SuperName__ = 'SYST Tools';
            child = SYST.extend(SYST.Tools.prototype, child);
            return child;
        }else{
            return new SYST.Tools({});
        }
    };
    SYST.T = SYST.Tools.prototype = {
        parseDom: function(htmlStr, tagPanel){
            var element = document.createElement(tagPanel || 'div');
            //jQuery || zepto
            if(SYST.$){
                SYST.$(element).html(htmlStr);
                return SYST.$(element)[0];
            }
            element.innerHTML = htmlStr;
            return element.childNodes;
        },
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
        trigger: function(element, event, data, callback){
            if(element && event && '' !== event){
                try{
                    element[method].call(element, data, arguments);
                    if(typeof callback === 'function') callback.call(element, data);
                }catch(e){
                    throw new Error(element + '不存在' + event + '方法 <::>');
                }
            }
        },
        /**
         * Function 去除两边空白
         * @param val
         * @return {*|void}
         */
        trim: function(val){
            return val.replace(/^\s*|\s*$/gi, '');
        },
        /**
         * Function 去除字符串首尾指定的字符
         * @param val       : 将要进行替换的字符串
         * @param commer    : 指定要替换的字符串
         * @param flag      : true: 全局替换；false: 只替换首尾
         * @return          : 返回替换后的字符串
         */
        rtrim:function(val, commer, flag){
            if(commer){
                var re;
                if(!flag)
                    re = new RegExp('^(\\' + commer +')*|(\\'+ commer + ')*$', 'gi');
                else
                    re = new RegExp('\\' + commer + '*', 'gi');
                return val.replace(re, '');
            }else{
                return this.trim(val);
            }
        },
        /**
         * Function 判断数组是否存在某元素  存在： 返回该元素索引； 不存在： 返回 -1
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
         * Function 全角字符转为半角,并去除所有空格
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
         * 转移html字符
         * @param html
         * @returns {string}
         */
        escapeHtml: function(html){
            return html.replace(/&(?![\w#]+;)|[<>"']/gi, function($1){
                return escapeMap[$1];
            });
        },
        /**
         * Function 格式化小于10的值
         * @param n
         * @return {String}
         */
        dateFm: function(n){ return (n < 10) ? '0'+n : n; },
        /**
         * Function 将指定时间戳转为： yyyy-mm-dd hh:ii:ss
         * @param timestamp
         * @return {String}
         */
        setDateFormat: function(timestamp, format, prefix){
            if(SYST.V.isEmpty(timestamp)) return '';
            var self = this;
            var date = new Date(parseInt(timestamp, 10)), ds = [], ts = [];
            if(!format)
                return date.getFullYear() +'-'+ this.dateFm(date.getMonth() + 1) +'-'+ this.dateFm(date.getDate()) + ' ' + this.dateFm(date.getHours()) + ':' + this.dateFm(date.getMinutes()) + ':' + this.dateFm(date.getSeconds());
            var cs = format.match(/[^\w\d\s]+?/i), c1 = cs[0] || '-', c2 = cs[1] || ':';
            if(/y+?/i.test(format))     push(date.getFullYear(), ds);
            if(/m+?/i.test(format))     push(date.getMonth() + 1, ds);
            if(/d+?/i.test(format))     push(date.getDate(), ds);
            if(/h+?/i.test(format))     push(date.getHours(), ts);
            if(/i+?/i.test(format))     push(date.getMinutes(), ts);
            if(/s+?/i.test(format))     push(date.getSeconds(), ts);
            function push(value, toAr){
                toAr.push(prefix ? self.dateFm(value) : value);
            }
            return SYST.T.trim(ds.join(c1) + (ts.length > 0 ? ' ' + ts.join(c2) : ''));
        },
        /**
         * Function 比较两个时间差 格式：YYYY-mm-dd
         * @param DateOne
         * @param DateTwo
         * @return {Number}
         */
        daysBetween: function(DateOne, DateTwo, callback){
            //获取第一个时间
            var OneMonth    = DateOne.substring(5, DateOne.lastIndexOf('-'));
            var OneDay      = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
            var OneYear     = DateOne.substring(0, DateOne.indexOf('-'));
            //获取第二个时间
            var TwoMonth    = DateTwo.substring(5,DateTwo.lastIndexOf('-'));
            var TwoDay      = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
            var TwoYear     = DateTwo.substring(0, DateTwo.indexOf('-'));

            var CDays = ((Date.parse(OneMonth +'/'+ OneDay +'/'+ OneYear) - Date.parse(TwoMonth +'/'+ TwoDay +'/'+ TwoYear)) / 86400000);

            if(callback && typeof callback === 'function'){
                callback(CDays);
            }else{
                //return Math.abs(CDays);
                return CDays;
            }
        },

        /**
         * Function 获取随机字符（包括数字和字母）
         * @param len:  字符长度
         * @param flag: 是否去除干扰
         * @return {String}
         */
        randomChar: function(size, flag){
            var start = 48,     end = 122,
                i = 0,          len = size,
                random,         rs = '',
                //特殊字符
                filter = [58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96],
                //去除扰乱视线 I L l o O
                f2 = [48, 49, 73, 76, 79, 108, 111];

            for( ; i < len; ++i ){
                random = Math.floor(Math.random() * s + Math.random() * e);
                if(random >= start && random <= end && filter.indexOf(r) === -1){
                    if(flag === true)   (f2.indexOf(r) === -1) ? rs += String.fromCharCode(10, random) : len++;
                    else                rs += String.fromCharCode(10, r);
                }else{
                    len++;
                }
            }
            return rs.replace(/[\n\t\r]*/gi, '');
        },
        /**
         * Function 获取指定参数或者所有参数列表
         * @param name
         * @returns {*}
         */
        params: function(name, url){
            if(this._pars && this._pars[name])
                return this._pars[name];
            //var search = (url ? url.split('?')[1] : location.search || location.href.split('?')[1]).replace(/^\?/, '');
            var search = '';
            if(!SYST.V.isEmpty(url)){
                search = url.split('?')[1] || '';
            }else{
                search = window.location.search.substr(1);
            }
            if(SYST.V.isEmpty(search)) return {};
            var mas = search.replace(/^\?/, '').split('&');
            if(!mas || [] === mas) return {};
            var i = 0, len = mas.length, ps = {};
            for( ; i < len; ++i ){
                //a=b | a=
                var ma = mas[i].split('=');
                if(!ma[0] || '' === ma[0])  continue;
                Object.defineProperty(ps, ma[0], { value: decodeURI(ma[1]) || null, writable: true, enumerable: true, configurable: true });
            }
            this._pars = ps;
            return (!name ? ps : decodeURI(ps[name]));

        },
        /**
         * 获取get模式下url中的指定参数值
         * @param name      参数名
         * @param url       传入的url地址
         * @returns {*}
         */
        getParams: function(name, url) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'), search = '';
            //var search = (url && url.split('?')[1] || window.location.search.substr(1)).match(reg);
            if(!SYST.V.isEmpty(url)){
                search = (url.split('?')[1] || '').match(reg);
            }else{
                search = window.location.search.substr(1).match(reg);
            }
            if(search) {
                return decodeURI(search[2]);
            }
            return null;
        },
        /**
         * 格式化参数 flag: 表示前面是否加上‘?’返回，true: 加上；false: 不加(默认)
         * @param object
         * @param flag
         * @returns {*}
         */
        paramData: function(object, flag){
            if(SYST.V.isEmpty(object) || !SYST.V.isObject(object))  return '';
            var data = object, s = '';
            for(var k in data)  (s += '&' + k + '=' + encodeURI(data[k]));
            s = s.substr(1);
            return (flag === true) ? '?'+ s : s;
        },
        /**
         * Function 浏览器 cookie操作
         * @param key       键名
         * @param value     键值
         * @param options   附件选项
         * @returns {*}
         * @constructor
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
         * 遍历对象
         * @param object
         * @param callback
         */
        each: function(object, callback){
            if(SYST.V.isObject(object)){
                var index = 0;
                for(var k in object){
                    callback.call(object, object[k], index++, k);
                }
            }
            else if(SYST.V.isArray(object)){
                var i = 0, len = object.length;
                for(; i < len; ++i){
                    callback(object[i], i);
                }
            }
            else{
                throw new SyntaxError('args1 is must Object or Array');
            }
        }
    };

})(SYST);

/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * SYST Template Render mini engine
     * @type {{open: string, close: string}}
     */
    SYST.tplConfig = { open: '<%', close: '%>'};
    var lineFeedRegx = /\\|'|\r|\n|\u2028|\u2029/g,
        body = '([\\s\\S]+?)',
        empty = /^=+\s*|\s*$/gi,
        lg = SYST.tplConfig.open,
        rg = SYST.tplConfig.close,
        regxs,
        macs;

    var _tplCache = {};

    //模板字符串中需要替换的特殊字符
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    //替换特殊字符
    var escapeSpecial = function(match) {
        return '\\' + escapes[match];
    };

    //将匹配正则对象转换为数据正则字符串
    var fromatRegx = function (rgs){
        var rs = [];
        for(var k in rgs){
            rs.push(rgs[k].source);
        }
        return rs.join('|').replace(/|$/i, '');
    };

    var _reset = function(){
        lg = SYST.tplConfig.open;
        rg = SYST.tplConfig.close;
        //匹配正则
        regxs = {
            execter:  new RegExp(lg + body + rg, 'g'),
            exporter: new RegExp(lg + '\\s*=' + body + rg, 'g'),
            escaper: new RegExp(lg + '\\s*==' + body + rg, 'g')
        };
        //定义模板全局匹配正则对象
        macs = new RegExp(fromatRegx(regxs), 'g');
    };

    /**
     * 渲染模板并输出结果
     * @param tplContent    模板字符串
     * @param data          模板数据变量
     * @param data          自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
     * @returns {string}    渲染后的字符串
     * @private
     */
    var _template = function(tplContent, data, helper, target){

        var $source = [],
            $text = [],
            $tplString = 'var _s=""; with($d || {}){ ',
            helperStr = '',
            index = 0,
            data = data;

        //判断helper是否存在
        if(helper){
            if(SYST.V.isObject(helper)){
                for(var k in helper){
                    helperStr += helper[k].toString() + ';';
                }
            }
            else if(SYST.V.isFunction(helper)){
                helperStr += helper.toString() + ';';
            }
            else if(SYST.V.isString(helper) && /function\(\)/gi.test(helper)){
                helperStr += helper.replace(/;$/i, '') + ';';
            }else{
                throw new EvalError('helper can be function');
            }

            $tplString = helperStr + $tplString;
        }

        /**
         * 将SYST.T.each方法置入Function字符串中
         * use:
         *  <% each(object|array, function(item, index, [key: options]) %>
         *      <%= item %>
         *  <% }); %>
         */
        $tplString = 'var each = ' + SYST.T.each.toString() + ';' + $tplString;

        /**
         * 采用替换查找方式
         * @params $1: match
         * @params $2: escape
         * @params $5: offset
         */
        tplContent.replace(macs, function($1, $2, $3, $4, $5){

            var text = tplContent.slice(index, $5).replace(lineFeedRegx, escapeSpecial);
            if(text && '' != text){
                text = "_s+='" + (text) + "';";
            }else{
                text = null;
            }
            index = $5 + $1.length;
            $text.push(text);
            $source.push(SYST.T.trim($2));

            return $1;
        });

        //如果没有匹配到任何模板语句的话直接返回
        if($source.length === 0){
            return tplContent;
        }

        //生成 Function 主体字符串
        var source, text;
        for(var i = 0, len = $source.length; i < len; ++i){
            source = $source[i];
            text = $text[i + 1];
            if(source.indexOf('==') !== -1){
                source = '_s+=(SYST.T.escapeHtml(' + source.replace(empty, "") + '));';
            }
            //转移处理
            else if(/^=[^=]+?/i.test(source)){
                source = '_s+=(' + (source.replace(empty, '')) + ');';
            }
            $tplString += (source || '') + (text || '');
        }

        //遍历数据
        $tplString = ''+ $tplString +' }; return _s;';
        //创建function对象
        var Render = new Function('$d', $tplString);
        //执行渲染方法
        $tplString = Render.call(target || this, data);
        return $tplString;
    };

    /**
     * 提供外部接口
     * @param content   元素id或者是模板字符串
     * @param data      渲染需要的数据
     * @param helper    自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
     * @returns {*}
     * @constructor
     */
    var Render = function(content, data, helper, target){

        var element, tplContent = '';

        //重置配置
        _reset();

        //如果直接是模板字符串
        if(content.search(/[<|>|\/]/i) !== -1){
            tplContent = SYST.T.trim(content);
        }
        //content为element id
        else{

            if(_tplCache[content]){
                return _tplCache[content];
            }
            element = document.querySelector('#' + content.replace('#'));
            if(element){
                var tplStr = /^(TEXTEREA|INPUT)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                tplContent = SYST.T.trim(tplStr);
            }
            _tplCache[content] = tplContent;
        }

        return _template(tplContent, data, helper, target);

    };

    SYST.Render = Render;

})(SYST);
/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * Module 事件处理（ 事件绑定 ）
     * @obj     事件侦听对象
     * @pobj    this作用域被替换对象
     * @evt     事件名称
     * @func    事件函数
     * @type {Function}
     */
    var Events = SYST.Events = function(obj, pobj, evt, func, type, trigger){
        var self = this;
        var type = type || 'on';
        var evts = "abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting cut copy paste".split(/\s+/gi);
        if(!obj) obj = window;

        //对象事件侦听
        for(var i = 0; i < evts.length; i++){
            if(evts[i] === evt){
                if(obj.selector == 'window'){
                    (type == 'on')
                        ? $(window).off().on(evt, SYST.hoadEvent(pobj, func))
                        : $(window).off(evt, SYST.hoadEvent(pobj, func));
                }else if(obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body'){
                    (type == 'on')
                        ? $(obj.selector).off().on(evt, SYST.hoadEvent(pobj, func))
                        : $(obj.selector).off(evt, SYST.hoadEvent(pobj, func));
                }else{
                    (type == 'on')
                        ? $(trigger || 'body').undelegate(obj.selector, evt, SYST.hoadEvent(pobj, func))
                        .delegate(obj.selector, evt, SYST.hoadEvent(pobj, func))
                        : $(trigger || 'body').undelegate(obj.selector, evt, SYST.hoadEvent(pobj, func));
                }
            }
        }

    };

})(SYST);

/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * Module 共享数据模型
     * @type {Object}
     */
    SYST._shareModels = [];
    var ShareModel = SYST.shareModel = {
        add: function(val){
            SYST._shareModels.push(val);
        },
        get: function(val){
            if(null == val){ return SYST._shareModels; }
            for(var i = 0; i < SYST._shareModels.length; ++i)
                if(val == SYST._shareModels[i])
                    return SYST._shareModels[i];
            return null;
        },
        remove: function(val){
            SYST.T.arrRemove(SYST._shareModels, val);
            return SYST._shareModels;
        },
        has: function(val){
            return SYST.T.indexOf(SYST._shareModels, val) !== -1;
        }
    };

})(SYST);

/**
 * Created by Rodey on 2015/10/16.
 *
 * Model 模型对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var Model = SYST.Model = function(child){
        this.__Name__ = 'Model';
        if(child){
            child = child || {};
            child.__SuperName__ = 'SYST Model';
            child = SYST.extend(SYST.Model.prototype, child);
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
            SYST.shareModel.add(this);
        },
        // 在本模型中存取
        get: function(key, options){    return this.attributes[key];    },
        set: function(key, value, options){
            if(key == null) return this;
            var attrs, options;
            if(key){
                if(typeof key === 'object'){
                    // this.set({ name: 'Rodey', age: 25 });
                    for(var k in key){
                        this.attributes[k] = key[k];
                    }
                }else if(typeof key === 'string' && key.length > 0){
                    //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                    this.attributes[key] = value;
                }else{
                    return this;
                }
            }
        },
        // 在localStorage中存取
        getItem: function(key, flag){
            var item =  (!flag ? window.localStorage : window.sessionStorage).getItem(key);
            try{
                item = JSON.parse(item);
            } catch(e){}
            return item;
        },
        setItem: function(key, value, flag){
            if(SYST.V.isObject(key)){
                // ({ name: 'Rodey', age: 25, phone: { name: 'iphone 5s', prize: 5000 } });
                for(var k in key){
                    _set(k, key[k]);
                }
            }else if(typeof key === 'string' && key.length > 0){
                // ('name', 'Rodey') || ('one', { name: 'Rodey', age: 25, isBoss: false });
                _set(key, value);
            }else{
                return this;
            }
            function _set(_k, _v){
                if(SYST.V.isObject(_v)){
                    _v = JSON.stringify(_v);
                }
                (!flag ? window.localStorage : window.sessionStorage).setItem(_k, _v);
            }
        },

        //判断某个属性是否存在
        has: function(key){ return Boolean(this.attributes[key]); },
        hasItem: function(key, flag){ return Boolean((!flag ? window.localStorage : window.sessionStorage).getItem(key)); },
        //动态添加属性
        add: function(key, value, options){ this.set(key, value, options); },
        /*addItem: function(key, value, options){ this.setItem(key, value, options) },*/
        //动态删除属性
        remove: function(key){
            if(!key || key == '') return this;
            this.attributes[key] = null;
            delete this.attributes[key];
        },
        removeItem: function(key, flag){ (!flag ? window.localStorage : window.sessionStorage).removeItem(key); },
        removeAll: function(flag){ flag ? (this.attributes = []) : (function(){ window.localStorage.clear(); window.sessionStorage.clear();})() },
        _getName: function(){ return this.__Name__; },
        /**
         * Function 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doRequest: function(url, postData, su, fail, options){
            var self = this, success, error, complete, type, dataType, setting = {};
            if(!postData || typeof postData !== 'object' || !url || url == '') return;

            if(options){
                type = options.type;
                dataType = options.dataType || self.ajaxDataType || 'json';
                setting = options;
            }else{
                type = self.ajaxType || 'POST';
                dataType = self.ajaxDataType || 'json';
            }
            //提交前触犯
            (self.ajaxBefore && SYST.V.isFunction(self.ajaxBefore)) && (setting['beforeSend'] = self.ajaxBefore.apply(self));

            var ajaxSetting = SYST.extend(setting, {
                url: url,
                type: type,
                data: postData,
                dataType: dataType,
                success: function(res){
                    //console.log('请求成功', res);
                    (self.ajaxSuccess && SYST.V.isFunction(self.ajaxSuccess)) && self.ajaxSuccess.call(self, res);
                    (su && SYST.V.isFunction(su)) && su.call(self, res);
                },
                error: function(xhr, errType){
                    //console.log('请求失败');
                    var response = xhr.response;
                    try{
                        response = JSON.parse(response);
                    }catch (e){}
                    (self.ajaxError && SYST.V.isFunction(self.ajaxError)) && self.ajaxError.call(self, response, xhr, errType);
                    (fail && SYST.V.isFunction(fail)) && fail.call(self, response, xhr, errType);
                },
                complete: function(res){
                    //console.log('请求完成');gulp
                    (self.ajaxComplete && SYST.V.isFunction(self.ajaxComplete)) && self.ajaxComplete.call(self, res);
                }
            });

            if(root.$){
                root.$.ajax(ajaxSetting);
            }else{
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        },
        /**
         * Function doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doAjax: function(url, postData, su, fail, options){
            this.doRequest(url, postData, su, fail, options);
        }
    };

})(SYST, window);
/**
 * Created by Rodey on 2015/10/20.
 *
 * Ajax 方法
 */

;(function(SYST){



    var xhr = new XMLHttpRequest(),
        //defaulst params
        defs = {
            dataType: 'json',
            type: 'POST',
            async: true,
            timeout: 5000,
            crossDomain: true,
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        };

    //callback ajax finish
    var format = function(text, type){
        var res = text;
        if('json' === type){
            try{ res = JSON.parse(text);        }catch(e){}
        }
        else if('text' === type){
            try{ res = JSON.stringify(text);    }catch(e){}
        }
        return res;
    };
    var callFunction = function(text, type, cb){
        var res = format(text, type);
        SYST.V.isFunction(cb) && cb(res);
    };

    var callComplate = function(xhr, type, cb){
        SYST.V.isFunction(cb) && cb(format(xhr.responseText, type), xhr);
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
    var _ajax = function(options){
        if(SYST.V.isObject(options)){
            defs = SYST.extend(options, defs);
        }
        if(SYST.V.isEmpty(defs.url)) return;
        var data = defs.data,
            url = defs.type.toUpperCase() === 'GET' ? defs.url.split('?')[0] + SYST.T.paramData(defs.data, true) : defs.url,
            body = defs.type.toUpperCase() === 'GET' ? undefined : data,
            async = 'async' in defs ? defs.async : true;

        //open before 请求之前
        callFunction(undefined, defs.dataType, defs.ajaxBefore);

        xhr.open(defs.type, url, async);
        for(var k in defs.header){
            xhr.setRequestHeader(k, defs.header[k]);
        }
        xhr.onreadystatechange = function(){
           if(xhr.readyState === 4){
               xhr.onreadystatechange = null;
                if(xhr.status === 200){
                    callFunction(xhr.responseText, defs.dataType, defs.success);
                }else{
                    callFunction(xhr, defs.dataType, defs.error);
                }
               callComplate(xhr, defs.dataType, defs.complate);
            }
        };
        xhr.send(body);

    };

    if(SYST){
        SYST.ajax = _ajax;
        SYST.Model.prototype.ajax = _ajax;
    }

})(SYST);


/**
 * Created by Rodey on 2015/10/16.
 *
 * Module 视图对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var View = SYST.View = function(child){
        this.__Name__ = 'View';
        if(child){
            child.__SuperName__ = 'SYST View';
            child = SYST.extend(SYST.View.prototype, child);
            !child.unInit && child._initialize();
            return child;
        }else{
            return new SYST.View({});
        }
    };

    SYST.View.prototype = {
        $el: {},
        tagPanel: 'selection',
        _initialize: function(){
            var self = this;
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.init && this.init.apply(this, arguments);
            if(this.render && SYST.V.isFunction(this.render)){
                var panel = '<' + self.tagPanel + '/>';
                self.$el = self.parseDom('', panel);
                self.render.apply(self, arguments);
            }

            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && SYST.V.isObject(this.events) &&  this.onEvent();
        },

        destroy: function(){
            this.$el.remove();
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
        hoadEvent: SYST.hoadEvent,
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        parseEvent: function(evtObj){
            if(!evtObj || evtObj.length == 0 || evtObj === {}) return this;
            var evts = [], objs = [], handleFunctions = [];
            for(var evt in evtObj){
                var eobj = evtObj[evt];
                if(SYST.V.isObject(eobj)){
                    for(var k in eobj){
                        var o = this.parseString(eobj, k), selector = o[0], evtType = o[1], func = o[2];
                        pushs(selector, evtType, func);
                    }
                }else{
                    var o = this.parseString(evtObj, evt), selector = o[0], evtType = o[1], func = o[2];
                    pushs(selector, evtType, func);
                }

            }

            function pushs(selector, evtType, func){
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
        },
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        autoHandleEvent: function(type){
            var parseEvents = this.parseEvent(this.events),
                evts = parseEvents['events'],
                objs = parseEvents['elements'],
                funs = parseEvents['functions'];
            if(!evts || evts.length == 0 || evts.length == {}) return this;
            var type = type || 'on';
            for(var i = 0, l = evts.length; i < l; i++){
                if(!evts[i])
                    throw new Error('对象侦听'+ evts[i] + '不存在');
                if(!funs[i])
                    throw new Error('对象'+ this + '不存在' + funs[i] + '方法');
                if(!objs[i])
                    throw new Error('事件函数'+ funs[i] + '不存在');

                SYST.Events($(objs[i]), this, evts[i], funs[i], type, this.triggerContainer || 'body');
            }
            return this;
        },

        parseString: function(obj, k){
            var o = ($.trim(k)).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType = o[0].replace(/^\s*|\s*$/gi, '');
            var func = obj[k];
            return [selector, evtType, func];
        },

        onEvent: function(selector, event, func){
            if(SYST.V.isEmpty(selector)) {
                this.autoHandleEvent('on');
            }else{
                SYST.Events.initEvent(SYST.V.isString(selector) ? $(selector) : selector, this, event, func, 'on', this.triggerContainer);
            }
        },

        offEvent: function(selector, event, func){
            //this.autoHandleEvent('off');
            if(SYST.V.isEmpty(selector)){
                this.autoHandleEvent('off');
            }else{
                //this._e.uninitEvent(selector, event, func);
                SYST.Events.initEvent(SYST.V.isString(selector) ? $(selector) : selector, this, event, func, 'off', this.triggerContainer);
            }
        },

        /**
         * Function 模板渲染
         * @param htmlStr
         * @param data
         * @return {*}
         */
        template: function(htmlStr, data, helper){
            var compHtml;
            compHtml = SYST.Render(htmlStr, data, helper, this);
            return compHtml;
        },
        //将元素转成对象并返回
        parseDom: function(htmlStr, tagPanel){
            return SYST.T.parseDom(htmlStr, tagPanel);
        },
        getController: function(){
            return this.controller;
        },
        getModel: function(){
            return this.model || this.getController().getModel();
        },
        shareModel: SYST.shareModels
    };

})(SYST, window);
/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';


    /**
     * Module 控制器对象
     * @type {Function}
     */
    var Controller = SYST.Controller = function(child){
        this.__Name__ = 'Controller';
        this.model = undefined;
        this.superView = undefined;
        this.shareModels = SYST.shareModel.get(null);
        if(child){
            child.__SuperName__ = 'SYST Controller';
            child = SYST.extend(SYST.Controller.prototype, child);
            child._initialize();
            return child;
        }else{
            return new SYST.Controller({});
        }
    };
    SYST.Controller.prototype = {
        defaultHost: location.host,
        shareModel: SYST.shareModel,
        _initialize: function(){
            this.init && this.init.apply(this, arguments);
        },
        getModel: function(key){
            if(key)     return this.shareModel.get(key);
            else        return this.model;
        },
        setModel: function(val){
            if(key !== '' || null != val){
                this.shareModel.add(val);
            }else if(typeof key === 'object'){
                this.model = key;
            }else{
                throw 'setModel: 参数有误';
            }
        }
    };

})(SYST);

/**
 * Created by Rodey on 2015/10/16.
 * Module Router 路由相关
 */

;(function(SYST){

    'use strict';

    //Router info
    /**
     * @type {Function}
     */
    var Router = SYST.Router = function(child){
        this.__Name__ = 'Router';
        if(child){
            child.__SuperName__ = 'SYST Router';
            child = SYST.extend(SYST.Router.prototype, child);
            //this._initialize();
            return child;
        }else{
            return new SYST.Router({});
        }
    };

    var uri = window.location,
        host = uri.host,
        port = uri.port,
        origin = uri.origin || (uri.protocol + '//' + host),
        pathname = uri.pathname,
        hash = uri.hash,
        supportPushState = 'pushState' in history,
        isReplaceState = 'replaceState' in history;

    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    var _getRouteKey = function(hash){
        return hash.replace(/[#!]/gi, '').split('?')[0];
    };

    SYST.R = SYST.Router.prototype = {
        _cache: {},
        _stateCache: [],

        //一个路由对象，包涵当前所有的路由列表
        //exp:
        // routers: {
        //      'user/': 'listController',
        //      'user/add': 'addController'
        // }
        routers: {},

        /**
         * $private 初始化
         * @private
         */
        _initialize: function(){
            if(this.routers && this.routers != {}){

                var routers = this.routers;
                for(var k in routers){
                    this._initRouters(k, routers[k]);
                }

                this.start();

            }
            this.init && SYST.V.isFunction(this.init) && this.init.apply(this);
        },

        /**
         * $private 将路由加入到缓存
         * @param route    路由字符串
         * @param object   路由处理对象
         * @private
         */
        _initRouters: function(route, object){

            this._cache[route] = object;

        },

        /**
         * $public 控制执行路由
         * @returns {SYST.Router}
         */
        start: function(){
            //如果初始化带有hash
            if(hash && '' !== hash){
                var currentRoute = _getRouteKey(hash);
                this.switch(currentRoute);
            }
            this._changeStart();
            return this;
        },
        stop: function(){
            this._changeStop();
        },

        /**
         * $public 匹配路由，添加到缓存
         * @param route
         * @param object
         */
        when: function(route, object){
            if(SYST.V.isEmpty(route))  return;
            if(SYST.V.isObject(object)){
                this._cache[route] = object;
            }else if(SYST.V.isFunction(object)){
                this._cache[route] = object.call(this);
            }

            return this;
        },

        /**
         * $public 路由更新时执行对应操作
         * @param route
         * @returns {SYST.Router}
         */
        switch: function(route){
            if(!this._cache || {} === this._cache)  return;
            //获取url参数列表
            this.params = SYST.T.params(null, window.location.href);
            //执行
            this._exec(route);
            return this;
        },

        //$private 根据路由获取当前路由配置对象
        _getRouter: function(route){

            if(!this._cache || this._cache === {})  return;
            var router, routeKey;
            for(var k in this._cache){
                var rt = this._routeToRegExp(k);
                if(rt.test(route)){
                    routeKey = k;
                    router = this._cache[k];
                    break;
                }
            }

            return {routeKey: routeKey, router: router};

        },

        /**
         * $private 路由到正则
         * @param route
         * @returns {RegExp}
         * @private
         */
        _routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },

        /**
         * $private 提取路由中的参数
         * @param route     路由匹配正则
         * @param route     路由配置中的规则字符串
         * @param fragment  当前url上的路由（hash）
         * @private
         */
        _extractParameters: function(route, rawRoute, fragment) {
            var params = route.exec(fragment).slice(1),
                keys = route.exec(rawRoute).slice(1),
                ps = [], rs = {};

            if(SYST.V.isArray(params) && params.length > 0){
                for(var i = 0, len = params.length; i < len; ++i){
                    var param = params[i];
                    ps.push(param ? decodeURIComponent(param) : null);
                }
            }

            if(SYST.V.isArray(keys) && keys.length > 0){
                for(var j = 0, len = keys.length; j < len; ++j){
                    var key = keys[j];
                    if(key){
                        rs[key.replace(/^[^\w]|[^\w]$/i, '')] = ps[j];
                    }
                }
            }

            return {paramsObject: rs, params: ps};
        },

        /**
         * $private 执行
         * @param route
         */
        _exec: function(route){
            var routeOption = this._getRouter(route),
                router = routeOption.router,
                routeKey = routeOption.routeKey;
            //保存当前路由控制对象
            this.currentRouter = router;
            this.currentRouter['route'] = routeKey;

            if(!SYST.V.isRegExp(routeKey))
                route = this._routeToRegExp(routeKey);
            var path = _getRouteKey(uri.hash);
            var parameter = this._extractParameters(route, routeKey, path),
                paramsObject = parameter.paramsObject,
                params = parameter.params;

            //合并参数列表
            this.params = SYST.extend(this.params, paramsObject);

            //路由开始状态事件
            this._onReady();
            this._execRouter(router);

        },
        _execRouter: function(router){
            var self = this;

            if(!router) return;
            if(router.template){
                this._template(router.template, router.container, function(htmlStr){

                    self._execMAction(router, htmlStr);
                    //路由模板渲染完成状态事件
                    self._onRender();
                });
            }else{
                self._execMAction(router);
            }

        },
        _execMAction: function(router, tpl){
            //保存当前模板字符串
            this.tpl = tpl;
            var vadding = { model: router.model, tpl: tpl, params: this.params, router: this},
                cadding = { model: router.model, tpl: tpl, params: this.params, router: this, view: router.view };
            //转换成SYST.Model
            router.model && (function(){
                return SYST.Model(router.model);
            })();
            router.view && (function(){
                return SYST.View(SYST.extend(router.view, vadding));
            })();
            router.controller && (function(){
                return SYST.Controller(SYST.extend(router.controller, cadding));
            })();
            router.action && SYST.V.isFunction(router.action) && router.action.call(this, router.model, tpl);

        },

        /**
         * $private 开始监听路由变化
         * @param callback
         * @private
         */
        _changeStart: function(){
            this._changeStop();
            window.addEventListener('hashchange', SYST.hoadEvent(this, '_changeHandler'), false);
        },
        _changeStop: function(){
            window.removeEventListener('hashchange', SYST.hoadEvent(this, '_changeHandler'), false);
        },
        _changeHandler: function(evt){

            var self = this,
                currentRouter = this.currentRouter;

            //前后路由数据保存
            this.oldURL = '#' + evt.oldURL.split('#')[1];
            this.newURL = '#' + evt.newURL.split('#')[1];
            //获取当前路由字符串
            var currentURL = _getRouteKey(this.newURL);
            //消费当前路由，加载下一个路由
            if(currentRouter){
                this._onDestroy(function(){
                    //开始路由
                    self.switch(currentURL);
                });
            }
        },

        /**
         * $private 解释html
         * @param html      模板字符串|模板地址
         * @param cid       当前路由容器id
         * @param callback  如果template为地址，则加载完成后的回调
         * @private
         */
        _template: function(html, cid, callback){
            var self = this;
            this.container = $('#' + cid.replace(/#/gi, ''));

            //模板是html字符串
            if(/<|>/g.test(html)){
                callback && SYST.V.isFunction(callback) && callback.call(self, html);
            }
            //模板是文件
            else{
                this.container.load(html, function(res){
                    callback && SYST.V.isFunction(callback) && callback.call(self, res);
                }, function(err){
                    throw new Error('load template is failed!');
                });
            }
        },
        //路由状态相关事件
        //$private 路由开始状态
        _onReady: function(){

            var router = this.currentRouter;
            if(router && router.onReady){
                router.onReady.call(this);
            }

        },
        //$private 路由模板渲染完成状态
        _onRender: function(cb){

            var router = this.currentRouter;
            //this._onAnimate('on', cb);
            cb && SYST.V.isFunction(cb) && cb();

            //模板渲染
            var html = SYST.Render(this.tpl, router.data);
            this.container.html(html);
            this.tpl = html;

            if(router && router.onRender){
                router.onRender.call(this, html);
            }

        },
        //$private 路由销毁状态
        _onDestroy: function(cb){
            var currentRouter = this.currentRouter,
                onDestroy = currentRouter.onDestroy,
                route = currentRouter.route,
                destroyState = currentRouter['_destroyState'];
            //this._onAnimate('off', cb);
            if(currentRouter && onDestroy){
                //根据前端返回的值，决定执行行为
                var ds = onDestroy.apply(this);
                if(ds !== false){
                    currentRouter['_destroyState'] = true;
                    cb && SYST.V.isFunction(cb) && cb();
                }else{
                    currentRouter['_destroyState'] = false;
                    this._updateHash(route);
                    //this.switch(route);
                }
            }else{
                cb && SYST.V.isFunction(cb) && cb();
            }

        },
        //$private 更新hash值
        _updateHash: function(hash){
            window.location.hash = '#!' + hash.replace(/^#!/i, '');
        },
        //$private 路由之间切换动画
        _onAnimate: function(type, cb){
            var router = this.currentRouter;
            if(!router)
                return;

            var animate = router.animate,
                duration = router.animateDuration || 300,
                container = this.container,
                type = type || 'on';

            if(router && container){
                switch (animate){
                    case 'slide':
                        type === 'on' ? container.slideDown(duration, cb) : container.slideUp(100, cb);
                        break;
                    case 'fade':
                        type === 'on' ? container.fadeIn(duration, cb) : container.fadeOut(100, cb);
                        break;
                    default :
                        container.show();
                        break;
                }
            }
        }

    };

})(SYST);


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
