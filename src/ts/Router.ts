/**
 * Created by Rodey on 2015/10/23.
 */
/// <reference path="zepto.d.ts" />

module YT{

    export class Router{

        public uri: any = window.location;
        public params: any;
        public tpl: string;
        public oldURL: string;
        public newURL: string;

        private _cache: any = {};
        private _v: YT.Validate;
        private _t: YT.Tools;
        private _syst: ST;

        public constructor(){
            this._v = new YT.Validate();
            this._t = new YT.Tools();

            for(var k in this.uri){
                if(this.uri.hasOwnProperty(k)){
                    this[k] = this.uri[k];
                }
            }

        }

        private _getRouteKey(hash: string){
            return hash.replace(/[#!]/gi, '').split('?')[0];
        }

        public start(){
            this.params = this._t.params();
            var hash = this['hash'];
            //如果初始化带有hash
            if(hash && '' !== hash){
                var currentRoute = this._getRouteKey(hash);
                this._exec(currentRoute);
            }
            this._change();
            return this;
        }
        public when(route: string, object: any): void{
            if(this._v.isObject(object)){
                this._cache[route] = object;
            }else if(this._v.isFunction(object)){
                this._cache[route] = object();
            }
        }
        public switch(route: any): YT.Router{
            var self = this;
            if(!this._cache || {} === this._cache)  return;
            this.params = this._t.params();

            this._exec(route);
            return this;
        }

        /**
         * 执行
         * @param route
         */
       public _exec(route: string){
            this._execRouter(route);
        }
       public _execRouter(route: string){
            var self: YT.Router = this;
            var routeOption: any = this._cache[route];
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

        }
       public _execMAction(routeOption: any, tpl?: string){
            this.tpl = tpl;
            var vadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this},
                cadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this, view: routeOption.view };
            //转换成SYST.Model
            this._syst = new ST();
            routeOption.model && (function(){ return this._syst.Model(routeOption.model); })();
            routeOption.view && (function(){ return this._syst.View(ST.extend(routeOption.view, vadding)); })();
            routeOption.controller && (function(){ return this._syst.Controller(ST.extend(routeOption.controller, cadding)); })();
            routeOption.action && this._v.isFunction(routeOption.action) && routeOption.action.call(this, routeOption.model, tpl);

       }

        /**
         * 开始监听路由变化
         * @param callback
         * @private
         */
        private _change(){
            var self: YT.Router = this;
            window.removeEventListener('hashchange', _hashChangeHandler, false);
            window.addEventListener('hashchange', _hashChangeHandler, false);
            function _hashChangeHandler(evt){
                self.oldURL = '#' + evt.oldURL.split('#')[1];
                self.newURL = '#' + evt.newURL.split('#')[1];
                var currentRoute = self._getRouteKey(self.newURL);
                self.switch(currentRoute);
            }
        }
        //解释html
        private _template(html: string, cid: string, callback?: Function){
            var self: YT.Router = this;
            var container = window['$']('#' + cid.replace(/#/gi, ''));
            if(/<|>/.test(html)){
                container.html(html);
                callback && this._v.isFunction(callback) && callback.call(self, html);
            }else{
                container.load(html, function(res?: any){
                    callback && this._v.isFunction(callback) && callback.call(self, res);
                }, function(err){
                    throw new Error('load template is failed!');
                });
            }
        }


    }

}