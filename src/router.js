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

