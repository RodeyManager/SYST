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
         * 跳转
         * @param url       地址
         * @param params    参数 [object|string]
         */
        jumpTo: function(url, params){
            var url = url || '#';
            if(SYST.V.isString(params))
                url = url + '?' + params;
            else if(SYST.V.isObject(params))
                url = url + SYST.T.paramData(params, true);
            location.href = url;
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
