/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Router = (function () {
        function Router() {
            this.uri = window.location;
            this.host = uri.host;
            this.port = uri.port;
            this.origin = uri.protocol + '//' + host;
            this.pathname = uri.pathname;
            this.hash = uri.hash;
            this._cache = {};
            this._v = new YT.Validate();
            this._t = new YT.Tools();
        }
        Router.prototype._getRouteKey = function (hash) {
            return hash.replace(/[#!]/gi, '').split('?')[0];
        };
        Router.prototype.start = function () {
            this.params = this._t.params();
            //如果初始化带有hash
            if (this.hash && '' !== this.hash) {
                var currentRoute = this._getRouteKey(this.hash);
                this._exec(currentRoute);
            }
            this._change();
            return this;
        };
        Router.prototype.when = function (route, object) {
            if (this._v.isObject(object)) {
                this._cache[route] = object;
            }
            else if (this._v.isFunction(object)) {
                this._cache[route] = object();
            }
        };
        Router.prototype.switch = function (route) {
            var self = this;
            if (!this._cache || {} === this._cache)
                return;
            this.params = this._t.params();
            this._exec(route);
            return this;
        };
        /**
         * 执行
         * @param route
         */
        Router.prototype._exec = function (route) {
            this._execRouter(route);
        };
        Router.prototype._execRouter = function (route) {
            var self = this;
            var routeOption = this._cache[route];
            if (!routeOption)
                return;
            if (routeOption.template) {
                this._template(routeOption.template, routeOption.container, function (htmlStr) {
                    //console.log(htmlStr);
                    //console.log(this);
                    self._execMAction(routeOption, htmlStr);
                });
            }
            else {
                self._execMAction(routeOption);
            }
        };
        Router.prototype._execMAction = function (routeOption, tpl) {
            this.tpl = tpl;
            var vadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this }, cadding = { model: routeOption.model, tpl: tpl, params: this.params, router: this, view: routeOption.view };
            //转换成SYST.Model
            this._syst = new SYST();
            routeOption.model && (function () {
                return this._syst.Model(routeOption.model);
            })();
            routeOption.view && (function () {
                return this._syst.View(SYST.extend(routeOption.view, vadding));
            })();
            routeOption.controller && (function () {
                return this._syst.Controller(SYST.extend(routeOption.controller, cadding));
            })();
            routeOption.action && this._v.isFunction(routeOption.action) && routeOption.action.call(this, routeOption.model, tpl);
        };
        /**
         * 开始监听路由变化
         * @param callback
         * @private
         */
        Router.prototype._change = function () {
            var self = this;
            window.removeEventListener('hashchange', _hashChangeHandler, false);
            window.addEventListener('hashchange', _hashChangeHandler, false);
            function _hashChangeHandler(evt) {
                self.oldURL = '#' + evt.oldURL.split('#')[1];
                self.newURL = '#' + evt.newURL.split('#')[1];
                var currentRoute = self._getRouteKey(self.newURL);
                self.switch(currentRoute);
            }
        };
        //解释html
        Router.prototype._template = function (html, cid, callback) {
            var self = this;
            var container = $('#' + cid.replace(/#/gi, ''));
            if (/<|>/.test(html)) {
                container.html(html);
                callback && this._v.isFunction(callback) && callback.call(self, html);
            }
            else {
                container.load(html, function (res) {
                    callback && this._v.isFunction(callback) && callback.call(self, res);
                }, function (err) {
                    throw new Error('load template is failed!');
                });
            }
        };
        return Router;
    })();
    YT.Router = Router;
})(YT || (YT = {}));
//# sourceMappingURL=Router.js.map