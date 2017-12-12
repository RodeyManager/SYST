/**
 * Created by Rodey on 2016/4/15.
 * Http 相关
 */

;(function(SYST){

    SYST.httpConfig = {};
    var Http = function(){
        this.__instance_SYST__ = 'SYST Http';
        this.__name__ = 'SYST Http';
    };
    SYST.Http = SYST.Request = function(){
        var http = SYST.extendClass(arguments, Http);
        http._initialize();
        return http;
    };

    var Ajax = SYST.Ajax;

    Http.prototype = {
        _initialize: function(){
            this.init && this.init.apply(this);
        },
        ajax: Ajax.ajax,
        get: Ajax.get,
        getJSON: Ajax.getJSON,
        post: Ajax.post,
        /**
         * Function 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doRequest: function(url, postData, su, fail, options){
            var type, dataType, commonData, commonHandler, setting = {}, callTarget;
            if(!postData || !SYST.V.isObject(postData) || !url) return;
            //记录当前ajax请求个数
            type = this.type || SYST.httpConfig.type || 'GET';
            dataType = this.dataType || SYST.httpConfig.dataType || 'json';
            commonData = this.commonData || SYST.httpConfig.commonData || {};
            callTarget = this.target || this;

            var ajaxBefore      = this.ajaxBefore   || SYST.httpConfig.ajaxBefore,
                ajaxSuccess     = this.ajaxSuccess  || SYST.httpConfig.ajaxSuccess,
                ajaxError       = this.ajaxError    || SYST.httpConfig.ajaxError,
                ajaxComplete    = this.ajaxComplete || SYST.httpConfig.ajaxComplete,
                ajaxEnd         = this.ajaxEnd      || SYST.httpConfig.ajaxEnd;

            if(SYST.V.isObject(options)){
                setting = options;
                commonHandler = options['commonHandler'];
                callTarget = options['callTarget'] || this;
            }

            var ajaxSetting = SYST.extend({
                url: url,
                type: type,
                data: SYST.extend(postData, commonData),
                dataType: dataType,
                before: ajaxBefore,
                success: function(){
                    //console.log('请求成功', res);
                    end(arguments);
                    //如果ajaxSuccess返回false 则将阻止之后的代码运行
                    var rs = success.apply(callTarget, arguments);
                    rs !== false && SYST.V.isFunction(su) && su.apply(callTarget, arguments);
                },
                error: function(){
                    //console.log('请求失败');
                    end(arguments);
                    //如果ajaxError返回false 则将阻止之后的代码运行
                    var rs = error.apply(callTarget, arguments);
                    rs !== false && SYST.V.isFunction(fail) && fail.apply(callTarget, arguments);
                },
                complete: ajaxComplete
            }, setting);
            function success(){
                var su;
                SYST.V.isFunction(ajaxSuccess) && (su = ajaxSuccess.apply(callTarget, arguments));
                return su;
            }
            function error(){
                var err;
                SYST.V.isFunction(ajaxError) && (err = ajaxError.apply(callTarget, arguments));
                return err;
            }
            function end(){
                SYST.V.isFunction(commonHandler) && commonHandler.call(callTarget);
                var end;
                SYST.V.isFunction(ajaxEnd) && (end = ajaxEnd.apply(callTarget, arguments));
                return end;
            }

            this.ajax(ajaxSetting);
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
        },
        load: Ajax.load,
        loadHTML: Ajax.loadHTML,
        /**
         * HTML5 fetch api
         * use: fetch(url, data, type)
         */
        fetch: Ajax.fetch,

        /**
         * HTML5 WebSockets Object
         * @param uri
         * @param options
         * @returns {WebSocket}
         */
        socket: function(uri, options){
            if(!'WebSocket' in window)
                throw new ReferenceError('WebSocket api is not support!');
            return new WebSocket(uri, options);
        },

        /**
         * 根据api对象自动生成对象方法
         * @param apis
         */
        generateApi: function(apis, options){
            SYST.V.isObject(apis) && SYST.T.each(apis, function(url, i, key){
                this._generateApi(key, url, options);
            }, this);
        },
        _generateApi: function(key, url, options){
            var self = this;
            options = SYST.V.isObject(options) && options || {};
            function _vfn(postData, su, fail, opts, target){
                options = SYST.extend(options, opts || {});
                options.callTarget = target || this.target || options.callTarget || this;
                this.doAjax(url, postData, su, fail, options);
            }
            ('defineProperty' in Object)
                ? Object.defineProperty(self, key, { value: _vfn.bind(this) })
                : (self[key] = _vfn);
        }

    }

})(SYST);
