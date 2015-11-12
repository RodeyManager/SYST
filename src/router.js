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

        /**
         * 开始执行路由
         * @returns {SYST.Router}
         */
        start: function(){

            //如果初始化带有hash
            if(hash && '' !== hash){
                var currentRoute = _getRouteKey(hash);
                this.switch(currentRoute);
            }
            this._change();
            return this;
        },

        /**
         * 匹配路由，添加到缓存
         * @param route
         * @param object
         */
        when: function(route, object){

            if(SYST.V.isObject(object)){
                this._cache[route] = object;
            }else if(SYST.V.isFunction(object)){
                this._cache[route] = object();
            }

            return this;
        },

        /**
         * 路由更新时执行对应操作
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
        /**
         * 执行
         * @param route
         */
        _exec: function(route){
            var routeOption = this._cache[route];
            //保存当前路由控制对象
            this.currentRouter = routeOption;
            //路由开始状态事件
            this._onReady();
            this._execRouter(routeOption);

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
            this.tpl = tpl;
            var vadding = { model: router.model, tpl: tpl, params: this.params, router: this},
                cadding = { model: router.model, tpl: tpl, params: this.params, router: this, view: router.view };
            //转换成SYST.Model
            router.model && (function(){ return SYST.Model(router.model); })();
            router.view && (function(){ return SYST.View(SYST.extend(router.view, vadding)); })();
            router.controller && (function(){ return SYST.Controller(SYST.extend(router.controller, cadding)); })();
            router.action && SYST.V.isFunction(router.action) && router.action.call(this, router.model, tpl);

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

                //前后路由数据保存
                self.oldURL = '#' + evt.oldURL.split('#')[1];
                self.newURL = '#' + evt.newURL.split('#')[1];
                //获取当前路由字符串
                var currentURL = _getRouteKey(self.newURL);
                //消费当前路由，加载下一个路由
                self._onDestroy(function(){
                    //开始路由
                    self.switch(currentURL);
                });

            }

        },
        //解释html
        _template: function(html, cid, callback){
            var self = this;
            this.container = $('#' + cid.replace(/#/gi, ''));

            //模板是html字符串
            if(/<|>/g.test(html)){
                this.container.html(html);
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

        //路由开始状态
        _onReady: function(){

            if(this.currentRouter && this.currentRouter.onReady){
                this.currentRouter.onReady.call(this);
            }

        },
        //路由模板渲染完成状态
        _onRender: function(cb){

            this._onAnimate('on', cb);
            if(this.currentRouter && this.currentRouter.onRender){
                this.currentRouter.onRender.call(this, this.tpl);
            }

        },
        //路由销毁状态
        _onDestroy: function(cb){

            this._onAnimate('off', cb);
            if(this.currentRouter && this.currentRouter.onDestroy){
                this.currentRouter.onDestroy.call(this, this.tpl);
            }

        },
        //路由之间切换动画
        _onAnimate: function(type, cb){
            var animate = this.currentRouter.animate,
                duration = this.currentRouter.animateDuration || 300,
                container = this.container,
                type = type || 'on';
            if(SYST.V.isEmpty(animate)){
                container.show(cb);
                return false;
            }
            if(this.currentRouter && container){
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

