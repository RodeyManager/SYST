;(function(SYST){

    //需要转移的字符
    var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        wordReg = /^([a-zA-Z]){1}/i;

    function each(data, callback, target){
        if(!data){
            throw new SyntaxError('args1 is must Object or Array or String');
        }
        var i = 0, len;
        if(SYST.V.isObject(data)){
            var index = 0, keys = Object.keys(data), key;
            len = keys.length;
            if(len === 0)  return;
            for(; i < len; ++i){
                key = keys[i];
                if(data.hasOwnProperty(key)){
                    if(false === callback.call(target || data, data[key], index++, key)) return data;
                }
            }
        }
        else if((data && data.length) || SYST.V.isArray(data)){
            if(!SYST.V.isArray(data)) data = slice.call(data);
            len = data.length;
            if(len === 0)  return;
            for(; i < len; ++i){
                if(false === callback.call(target || data, data[i], i)) return data;
            }
        }
        else{}
    }

    /**
     * Function 浏览器 cookie操作
     * @param key       键名
     * @param value     键值
     * @param options   附件选项
     * @returns {*}
     * @constructor
     */
    function Cookie(key, value, options) {
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
    }
    function _Cookies(keys, options){
        var value;
        if(!keys) return;
        if(SYST.V.isObject(keys)){
            each(Object.keys(keys), function(key){
                value = keys[key];
                value && Cookie(key, keys[key], options);
            },  this);
        }
        else if(SYST.V.isArray(keys)){
            var rs = {}, name;
            for(var i = 0, len = keys.length; i < len; ++i){
                name = keys[i];
                rs[name] = Cookie(name);
            }
            return rs;
        }
    }

    var cookie = {
        add: function(key, val, options){

        },
        remove: function(key){}
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
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param obj       作用域目标对象
         * @param func      obj对象中的属性
         * @param cature    是否阻止事件冒泡
         * @returns {Function}
         * SYST.Dom('#btn').on('click', SYST.T.proxy(view, 'onLogin'));
         */
        proxy: function(obj, func, cature){
            var args = [];
            obj = obj || window;
            var i = 2;
            if(cature == undefined){
                cature = true;
            }else{
                i = 3;
            }
            for(; i < arguments.length; i++) args.push(arguments[i]);
            return function(e){
                if(e && /^\[object\s[A-Z][a-z]+Event\]$/.test(toString.call(e)) && cature){
                    //e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
                //args.unshift(e);
                var _args = slice.call(arguments);
                //保证传递 Event对象过去
                if(SYST.V.isFunction(func)){
                    return func.apply(obj, _args);
                }else if(obj[func])
                    return obj[func].apply(obj, _args);
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
            array = slice.call(array);
            for (var i = 0, len = array.length; i < len; i++)
                if (obj === array[i]) return i;
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
            if(!str)    return '';
            return wordReg.test(str) ?
                str.replace(wordReg, function(match, $1){ return $1.toUpperCase(); }) : str;
        },
        //首字符小写
        toFirstLowerCase: function(str){
            if(!str)    return '';
            return wordReg.test(str) ?
                str.replace(wordReg, function(match, $1){ return $1.toLowerCase(); }) : str;
        },
        /**
         * Function 全角字符转为半角,并去除所有空格
         * @param str
         * @return {String}
         * @constructor
         */
        F2C: function(str){
            var s = "", str = str.replace(/\s*/gi, '');
            for(var i = 0, len = str.length; i < len; i++){
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
            if(!date) return '';
            var self = this;
            format = format || 'yyyy-mm-dd hh:ii:ss';
            date = (/^\d+$/gi.test(date) || /\d+[\/-]+/gi.test(date)) ? new Date(parseInt(date, 10)) : SYST.V.isDate(date) ? date : null;
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
                return m.length > 1 ? self.dateFm(val) : val;
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
            this.each(ds, function(dv, i){
                ds[i] = (i === 3 ? ' ' : '') + dv + fs[i];
            });
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
            var s = '';
            each(object, function(v, i, k){ s += '&' + k + '=' + encodeURI(v); });
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
         * use: displace('my name is %s, age is %d', 'rodey', 26);
         */
        displace: function(str){
            if(!str) return;
            var index = 0, args = [],
                regx = /\%[s|d|f]+?/gi;
            each(slice.call(arguments, 1), function(arg){  args.push(arg); });
            str = str.replace(regx, function(match){
                return args[index++];
            });
            return str;
        },
        Cookie: Cookie,
        getCookie: function(key){
            return SYST.V.isString(key)
                ? Cookie(key)
                : _Cookies(key);
        },
        setCookie: function(key, value, options){
            return SYST.V.isString(key)
                ? Cookie(key, value, options)
                : _Cookies(key, options);
        },

        /**
         * 遍历对象
         * @param object
         * @param target   回调作用域对象
         * @param callback
         */
        each: each,
        extend: SYST.extend,
        clone: SYST.clone,

        /**
         * 数组转成Object对象
         * @param arr
         * @param key
         * @param flag      是否以数组元素作为Object的key
         * @returns {{}}
         */
        arr2object: function(arr, key, flag){
            var _obj = {};
            if(key){
                _obj[key] = arr;
            }else{
                each(arr, function(v, i){
                    flag ? (_obj[v] = v) : (_obj[i] = v);
                });
            }
            return _obj;
        },
        /**
         * 数组去重
         * @param arr
         * @returns {Array}
         */
        unique: function(arr) {
            var result = [];
            each(arr, function(v){ result.indexOf(v) === -1 && result.push(v); });
            return result;
        },
        /**
         * 合并数组或对象
         * @param v1
         * @param v2
         * @param flag (是否对合并的数据进行去重)
         */
        merge: function(v1, v2, flag){
            var rs;
            if(!v1) return v2;
            if(!v2) return v1;
            if(SYST.V.isArray(v1) && SYST.V.isArray(v2)){
                rs = [].concat(v1, v2);
                rs = (flag === true) ? this.unique(rs) : rs;
            }
            else if(SYST.V.isObject(v1) && SYST.V.isObject(v2)){
                rs = SYST.extend(v1, v2);
            }
            else{
                rs = v1 + v2;
            }
            return rs;
        },
        json: {
            stringify: function(){
                return JSON.stringify.apply(null, arguments).replace(/\"/g, "_@");
            },
            parse: function(){
                var str = arguments[0].replace(/_\@/g, '"');
                return JSON.parse(str);
            }
        }
    };

})(SYST);
