/**
 * Created by Rodey on 2016/4/15.
 * Http 相关
 */


;(function(SYST){

    'use strict';

    var _$ = SYST.$;
    if(!_$){
        throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
    }

    SYST.httpConfig = {};
    var Http = function(){
        this.__instance_SYST__ = 'SYST Http';
        this.__name__ = 'SYST Http';
    };
    SYST.Http = function(){
        return SYST.extendClass(arguments, Http);
    };

    //SYST.Http.prototype = {
    Http.prototype = {

        load: function(dom, url, data, callback){
            _$(dom).load(url, data, callback);
        },
        ajax: _$.ajax,
        get: _$.get,
        getJSON: _$.getJSON,
        getScript: _$.getScript,
        post: _$.post,

        /**
         * Function 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doRequest: function(url, postData, su, fail, options){
            var self = this, type, dataType, commonData, setting = {}, callTarget;
            if(!postData || typeof postData !== 'object' || !url || url == '') return;
            //记录当前ajax请求个数
            self._ajaxCount = 0;
            this.ajaxUrl = url;
            dataType = self.ajaxDataType || SYST.httpConfig['ajaxDataType'] || 'json';

            var ajaxBefore      = self.ajaxBefore   || SYST.httpConfig.ajaxBefore,
                ajaxSuccess     = self.ajaxSuccess  || SYST.httpConfig.ajaxSuccess,
                ajaxError       = self.ajaxError    || SYST.httpConfig.ajaxError,
                ajaxComplete    = self.ajaxComplete || SYST.httpConfig.ajaxComplete,
                ajaxEnd         = self.ajaxEnd      || SYST.httpConfig.ajaxEnd;

            if(SYST.V.isObject(options)){
                type = options.type || self.ajaxType || SYST.httpConfig['ajaxType'] || 'POST';
                dataType = options.dataType || self.ajaxDataType || SYST.httpConfig['ajaxDataType'] || 'json';
                commonData = options.commonData || self.commonData || SYST.httpConfig['commonData'] || {};
                setting = options;
                callTarget = options['callTarget'] || self;
            }
            //提交前触犯
            if(before() === false) return;

            var ajaxSetting = SYST.extend(setting, {
                url: url,
                type: type,
                data: SYST.extend(postData, commonData),
                dataType: dataType,
                success: function(res, data, status, xhr){
                    //console.log('请求成功', res);
                    end(res, data, status, xhr);
                    //如果ajaxSuccess返回false 则将阻止之后的代码运行
                    var rs = success(res, data, status, xhr);
                    rs !== false && SYST.V.isFunction(su) && su.call(callTarget, res, data, status, xhr);
                },
                error: function(xhr, errType){
                    //console.log('请求失败');
                    var response = xhr.response;
                    try{
                        response = JSON.parse(response);
                    }catch(e){
                    }
                    end(response, xhr, errType);
                    //如果ajaxError返回false 则将阻止之后的代码运行
                    var rs = error(response, xhr, errType);
                    rs !== false && SYST.V.isFunction(fail) && fail.call(callTarget, response, xhr, errType);
                },
                complete: function(res, data, status, xhr){
                    //console.log('请求完成');
                    complate(res, data, status, xhr);
                }
            });

            function before(){
                SYST.V.isFunction(ajaxBefore) && (setting['beforeSend'] = ajaxBefore.apply(callTarget));
                if(setting['beforeSend'] === false) return false;
            }

            function success(res, data, status, xhr){
                var su;
                SYST.V.isFunction(ajaxSuccess) && (su = ajaxSuccess.call(callTarget, res, data, status, xhr));
                return su;
            }

            function error(res, xhr, errType){
                var err;
                SYST.V.isFunction(ajaxError) && (err = ajaxError.call(callTarget, res, xhr, errType));
                return err;
            }

            function complate(res, data, status, xhr){
                var complete;
                SYST.V.isFunction(ajaxComplete) && (complete = ajaxComplete.call(callTarget, res, data, status, xhr));
                return complete;
            }

            function end(res, data, status, xhr){
                var end;
                SYST.V.isFunction(ajaxEnd) && (end = ajaxEnd.call(callTarget, res, data, status, xhr));
                return end;
            }

            _$.ajax(ajaxSetting);
            self._ajaxCount++;
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

        /**
         * HTML5 fetch api
         */
        fetch: (function(){
            //throw new ReferenceError('fetch api is not support!');
            return function(url, init, type){
                init = init || {};
                var headers = init['headers'] || {},
                    method = (init['method'] || 'post').toUpperCase(),
                    body = init['body'];
                if(!'fetch' in window){
                    var p = new SYST.Promise();
                    var setting = $.extend(init, {
                        url: url,
                        data: body,
                        type: method,
                        dataType: type,
                        success: function(res){ p.resolve(res); },
                        error: function(err){   p.reject(err);  }
                    });
                    _$.ajax(setting);
                    return p;
                }else{
                    if(method == 'GET' || method == 'HEAD'){
                        if(SYST.V.isObject(body))
                            url += SYST.T.paramData(body, true);
                        else if(SYST.V.isString(body))
                            url += '?' + body;
                        init['body'] = null;
                        delete init['body'];
                    }else{
                        SYST.V.isObject(body) && (init['body'] = JSON.stringify(body));
                    }
                    return window['fetch'](url, init).then(function(res){
                        return (SYST.V.isFunction(res[type]) && res[type]());
                    });
                }
            };
        })(),

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
        }

    }


})(SYST);
