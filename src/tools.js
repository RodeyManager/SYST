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
    var Tools = function(){
        this.__instance_SYST__ = 'SYST Tools';
        this.__Name__ = 'Tools';
    };
    SYST.Tools = function(){
        return SYST.extendClass(arguments, Tools);
    };
    SYST.T = Tools.prototype = {
        /**
         * Function 触发事件
         * @param  {[type]}   element  [触发对象]
         * @param  {[type]}   event    [事件名称]
         * @param  {[type]}   data     [参数]
         * @param  {Function} callback [回调]
         * @return {[type]}            [undefined]
         * use:
         * $(document.body).bind('click', function(){});
         * SYST.T.trigger($(document.body)[0], 'onclick', 'hello', function(evt, data){
         *     console.log(this); //output:     <body>...</body。
         *     console.log(data); //output；    'hello'
         * });
         */
        trigger: function(element, event, data, callback){
            var handler;
            if(element && event && '' !== event){
                event = event.search(/^(on)/i) !== -1 ? event : 'on' + event;
                handler = function(evt){
                    SYST.V.isFunction(callback) && callback.call(element, evt, data);
                };
                try{
                    element[event] = handler;
                }catch(e){
                    throw new Error(element + '不存在' + event + '方法 <::>');
                }
            }
        },
        /**
         * 事件侦听传递处理回调
         * @param obj       作用域目标对象
         * @param func      obj对象中的属性
         * @returns {Function}
         */
        hoadEvent: function(obj, func){
            var args = [];
            obj = obj || window;
            for(var i = 2; i < arguments.length; i++) args.push(arguments[i]);
            return function(e){
                if(e && typeof e === 'object'){
                    e.preventDefault();
                    e.stopPropagation();
                }
                args.push(e);
                //保证传递 Event对象过去
                if(obj[func])
                    obj[func].call(obj, e, args);
                else
                    throw new Error(func + ' 函数未定义！');
            }
        },
        /**
         * Function 去除两边空白
         * @param val
         * @return {*|void}
         */
        trim: function(val){
            return SYST.V.isString(val) ? val.replace(/^\s*|\s*$/gi, '') : '';
        },
        /**
         * Function 去除字符串首尾指定的字符
         * @param val       : 将要进行替换的字符串
         * @param commer    : 指定要替换的字符串
         * @param flag      : true: 全局替换；false: 只替换首尾
         * @return          : 返回替换后的字符串
         */
        rtrim:function(val, commer, flag){
            if(!SYST.V.isString(val)) return '';
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
         * Function 判断数组或字符串是否存在某元素  存在： 返回该元素索引； 不存在： 返回 -1
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
            return array;
        },
        //首字符大写
        toFirstUpperCase: function(str){
            return str.replace(/^(\w)?/i, function(match, $1){ return $1.toUpperCase(); });
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
         * @param date Date对象 | 时间戳 | 时间字符串，如：1462327561371 或 '2016/5/4 10:03:20'
         * @param format {String} yyyy-mm-dd hh:ii:ss | yyyy-m-d
         * @return {String}
         */
        setDateFormat: function(date, format){
            if(!timestamp) return '';
            format = format || 'yyyy-mm-dd hh:ii:ss';
            date = (/^\d+$/gi.test(date) || /\d+\/+/gi.test(date)) ? new Date(date) : SYST.V.isDate(date) ? date : null;
            if(!date)   return null;
            format = format.replace(/(y+)/i, function(m){
                var year = '' + date.getFullYear();
                return m.length >= 4 ? year : year.substr(m.length);
            }).replace(/(m+)/i, function(m){
                return _toFormat(m, date.getMonth() + 1);
            }).replace(/(d+)/i, function(m){
                return _toFormat(m, date.getDate());
            }).replace(/(h+)/i, function(m){
                return _toFormat(m, date.getHours());
            }).replace(/(i+)/i, function(m){
                return _toFormat(m, date.getMinutes());
            }).replace(/(s+)/i, function(m){
                return _toFormat(m, date.getSeconds());
            });

            function _toFormat(m, val){
                return m.length > 1 ? this.dateFm(val) : val;
            }

            return format;
        },
        dateFormat: function(date, format){
            return this.setDateFormat(date, format);
        },

        /**
         * 将时间转为中文格式时间
         */
        setDateFormatCN: function(date, format){
            var fs = ['年', '月', '日', '时', '分', '秒', '毫秒'],
                ds = this.setDateFormat(date, format).split(/[-:\s]+/gi);
            if(!ds || ds.length === 0)  return '';
            for(var i = 0; i < ds.length; ++i){
                ds[i] = (i === 3 ? ' ' : '') + ds[i] + fs[i];
            }
            return ds.join('');

        },
        dateFormatCN: function(date, format){
            return this.setDateFormatCN(date, format);
        },

        /**
         * 计算时间差，包括 天、时分秒
         * @param d1    开始时间  yyyy-mm-dd h:i:s | Date
         * @param d2    结束时间
         * @returns {{days: (*|Number)}}
         */
        getDateDiff: function(d1, d2){
            var diff = Date.parse(d2) - Date.parse(d1),
                days = Math.floor(diff / (24 * 3600 * 1000)),
                le1 = diff % (24 * 3600 * 1000),
                hours = Math.floor(le1 / (3600 * 1000)),
                le2 = le1 % (3600 * 1000),
                minutes = Math.floor(le2 / (60 * 1000)),
                le3 = le2 % (60 * 1000),
                seconds = Math.round(le3 / 1000);
            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        },

        /**
         * Function 获取随机字符（包括数字和字母）
         * @param size:  字符长度
         * @param flag: 是否去除干扰
         * @return {String}
         */
        randomChar: function(size, flag){
            var start = 48,     end = 122,
                i = 0,          len = size,
                random,         rs = '',
                flag = true,
                //特殊字符
                filter = [58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96],
                //去除扰乱视线 I L l o O
                f2 = [48, 49, 73, 76, 79, 108, 111];

            for( ; i < len; ++i ){
                random = Math.floor(Math.random() * start + Math.random() * end);
                if(random >= start && random <= end && filter.indexOf(random) === -1){
                    if(flag === true)   (f2.indexOf(random) === -1) ? rs += String.fromCharCode(10, random) : len++;
                    else                rs += String.fromCharCode(10, random);
                }else{
                    len++;
                }
            }
            return rs.replace(/[\n\t\r]*/gi, '');
        },
        /**
         * Function 获取指定参数或者所有参数列表
         * @param name
         * @param url       传入的url地址
         * @returns {Object|String}
         */
        params: function(name, url){
            var grap = '?';
            if(this._pars && this._pars[name])
                return this._pars[name];
            //var search = (url ? url.split('?')[1] : location.search || location.href.split('?')[1]).replace(/^\?/, '');
            var search = '';
            if(!SYST.V.isEmpty(url)){
                if(/\?+/i.test(url))
                    search = url.split(grap)[1] || '';
                else
                    search = url;
            }else{
                search = location.href.split(grap)[1];
            }
            if(SYST.V.isEmpty(search)) return {};
            var mas = search.replace(/^\?/, '').split('&');
            if(!mas || [] === mas) return {};
            var i = 0, len = mas.length, ps = {};
            for( ; i < len; ++i ){
                //a=b | a=
                var ma = mas[i].split('=');
                if(!ma[0] || '' === ma[0])  continue;
                ps[ma[0]] = decodeURI(ma[1]) || null;
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
        serialize: function(object, flag){ return this.paramData(object, flag); },
        unserialize: function(str){ return this.params(null, str); },
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
        redirect: function(url, params){ this.jumpTo(url, params); },

        /**
         * 组装字符串
         * @param str
         * @returns {*}
         * use: displace('my name is \s, age is \d', 'rodey', 26);
         */
        displace: function(str){
            if(!str) return;
            var index = 0, args = [],
                regx = /\%[s|d|f]?/gi;
            for(var i = 1, len = arguments.length; i < len; ++i)
                args.push(arguments[i]);
            var string = str.replace(regx, function(match){
                return args[index++];
            });
            return string;
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
        _Cookies: function(keys, options){
            var self = this;
            if(!keys) return;
            if(SYST.V.isObject(keys)){
                SYST.T.each(Object.keys(keys), function(key){
                    self.Cookie(key, keys[key], options);
                });
            }
            else if(SYST.V.isArray(keys)){
                var rs = {}, name;
                if(keys.length === 1){
                    name = keys[0];
                    rs[name] = self.getCookie(name);
                }else{
                    for(var i = 0, len = keys.length; i < len; ++i){
                        name = keys[i];
                        rs[name] = self.getCookie(name);
                    }
                }
                return rs;
            }
        },
        getCookie: function(key){
            return SYST.V.isString(key)
                ? this.Cookie(key)
                : this._Cookies(key);
        },
        setCookie: function(key, value, options){
            return SYST.V.isString(key)
                ? this.Cookie(key, value, options)
                : this._Cookies(key, options);
        },

        /**
         * 遍历对象
         * @param object
         * @param target   回调作用域对象
         * @param callback
         */
        each: function(object, callback, target){
            if(SYST.V.isObject(object)){
                var index = 0;
                for(var k in object){
                    if(object.hasOwnProperty(k)){
                        callback.call(target || object, object[k], index++, k);
                    }
                }
            }
            else if(SYST.V.isArray(object)){
                var i = 0, len = object.length;
                for(; i < len; ++i){
                    callback.call(target || object, object[i], i);
                }
            }
            else{
                throw new SyntaxError('args1 is must Object or Array');
            }
        }
    };

})(SYST);
