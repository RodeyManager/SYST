/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    //Router info
    /**
     * Module web通用公共函数对象
     * @type {Function}
     */
    var Router = SYST.Router = function(child){
        this.__Name__ = 'Router';
        if(child){
            child.__SuperName__ = 'SYST Router';
            child = SYST.extend(SYST.Router.prototype, child);
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
        hash = uri.hash;

    var _getRouteKey = function(hash){
        return hash.replace(/[#!]/gi, '').split('?')[0];
    };

    SYST.R = SYST.Router.prototype = {
        _cache: {},
        start: function(){
            this.params = SYST.T.params();
            //如果初始化带有hash
            if(hash && '' !== hash){
                var currentRoute = _getRouteKey(hash);
                this._exec(currentRoute);
            }
            this._change();
            return this;
        },
        when: function(route, object){
            if(SYST.V.isObject(object)){
                this._cache[route] = object;
            }else if(SYST.V.isFunction(object)){
                this._cache[route] = object();
            }
        },
        switch: function(route){
            var self = this;
            if(!this._cache || {} === this._cache)  return;
            this.params = SYST.T.params();

            this._exec(route);
            return this;
        },
        /**
         * 执行
         * @param route
         */
        _exec: function(route){
            this._execRouter(route);
        },
        _execRouter: function(route){
            var self = this;
            var routeOption = this._cache[route];
            if(!routeOption) return;
            if(routeOption.template){
                this._template(routeOption.template, routeOption.container, function(htmlStr){
                    //console.log(htmlStr);
                    //console.log(this);
                    self._execMAction(routeOption, htmlStr);
                });
            }else{
                self._execMAction(routeOption);
            }

        },
        _execMAction: function(routeOption, tpl){
            this.tpl = tpl;
            var vadding = { model: routeOption.model, tpl: tpl, params: self.params, router: this},
                cadding = { model: routeOption.model, tpl: tpl, params: self.params, router: this, view: routeOption.view };
            //转换成SYST.Model
            routeOption.model && (function(){ return SYST.Model(routeOption.model); })();
            routeOption.view && (function(){ return SYST.View(SYST.extend(routeOption.view, vadding)); })();
            routeOption.controller && (function(){ return SYST.Controller(SYST.extend(routeOption.controller, cadding)); })();
            routeOption.action && SYST.V.isFunction(routeOption.action) && routeOption.action.call(this, routeOption.model, tpl);

        },
        /**
         * 开始监听路由变化
         * @param callback
         * @private
         */
        _change: function(){
            var self = this;
            window.removeEventListener('hashchange', _hashChangeHandler, false);
            window.addEventListener('hashchange', _hashChangeHandler, false);
            function _hashChangeHandler(evt){
                self.oldURL = '#' + evt.oldURL.split('#')[1];
                self.newURL = '#' + evt.newURL.split('#')[1];
                var currentRoute = _getRouteKey(self.newURL);
                self.switch(currentRoute);
            }
        },
        //解释html
        _template: function(html, cid, callback){
            var self = this;
            var container = $('#' + cid.replace(/#/gi, ''));
            if(/<|>/.test(html)){
                container.html(html);
                callback && SYST.V.isFunction(callback) && callback.call(self, html);
            }else{
                container.load(html, function(res){
                    callback && SYST.V.isFunction(callback) && callback.call(self, res);
                }, function(err){
                    throw new Error('load template is failed!');
                });
            }
        }
    };

})(SYST);

