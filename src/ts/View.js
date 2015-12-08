/**
 * Created by Rodey on 2015/10/21.
 */
var YT;
(function (YT) {
    var View = (function () {
        function View(child) {
            this.isInit = true;
            this.unInit = false;
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            this.$el = {};
            this.tagPanel = '';
            this.triggerContainer = 'body';
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            this._e = new YT.Event();
            this._type = 'on';
            !this.unInit && this._initialize();
        }
        View.getInstance = function (child) {
            if (this._self)
                return this._self;
            return new YT.View(child);
        };
        View.prototype._initialize = function () {
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.isInit && this.init && this.init.apply(this, arguments);
            if (this.render) {
                var panel = '<' + this.tagPanel + '/>';
                this.$el = $ ? $(panel) : this.parseDom('', panel);
                this.render.apply(this, arguments);
            }
            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && this._v.isObject(this.events) && this.onEvent();
        };
        View.prototype.init = function () {
            console.log('...View init...');
        };
        View.prototype.render = function () {
        };
        View.prototype.parseDom = function (htmlStr, tagPanel) {
            return this._t.template(htmlStr, tagPanel);
        };
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        View.prototype.parseEvent = function (evtObj) {
            if (!evtObj || evtObj.length == 0 || evtObj === {})
                return this;
            var evts = [], objs = [], handleFunctions = [];
            for (var evt in evtObj) {
                var eobj = evtObj[evt];
                if (this._v.isObject(eobj)) {
                    for (var k in eobj) {
                        var o = this.parseString(eobj, k), selector = o[0], evtType = o[1], func = o[2];
                        pushs(selector, evtType, func);
                    }
                }
                else {
                    var o = this.parseString(evtObj, evt), selector = o[0], evtType = o[1], func = o[2];
                    pushs(selector, evtType, func);
                }
            }
            function pushs(selector, evtType, func) {
                objs.push(selector);
                evts.push(evtType);
                handleFunctions.push(func);
            }
            //储存事件名称
            //this.evts = evts;
            //储存事件侦听对象
            //this.objs = objs;
            //储存事件函数
            //this.handleFunctions = handleFunctions;
            return { events: evts, elements: objs, functions: handleFunctions };
        };
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        View.prototype.autoHandleEvent = function (type) {
            var parseEvents = this.parseEvent(this.events), evts = parseEvents['events'], objs = parseEvents['elements'], funs = parseEvents['functions'];
            if (!evts || evts.length == 0 || evts.length == {})
                return this;
            var type = type || this._type;
            for (var i = 0, l = evts.length; i < l; i++) {
                if (!evts[i])
                    throw new Error('对象侦听' + evts[i] + '不存在');
                if (!funs[i])
                    throw new Error('对象' + this + '不存在' + funs[i] + '方法');
                if (!objs[i])
                    throw new Error('事件函数' + funs[i] + '不存在');
                this._e.initEvent($(objs[i]), this, evts[i], funs[i], type, this.triggerContainer);
            }
            return this;
        };
        View.prototype.parseString = function (obj, k) {
            var o = ($.trim(k)).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType = o[0].replace(/^\s*|\s*$/gi, '');
            var func = obj[k];
            return [selector, evtType, func];
        };
        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        View.prototype.handEvent = function (callback, value) {
            var self = this, args = [];
            for (var i = 2; i < arguments.length; i++)
                args.push(arguments[i]);
            return function (e) {
                args.push(value);
                args.push(e);
                callback.apply(self, args);
            };
        };
        View.prototype.destroy = function () {
            this.$el.remove && this.$el.remove();
        };
        View.prototype.onEvent = function (selector, event, func) {
            if (this._v.isEmpty(selector)) {
                this.autoHandleEvent('on');
            }
            else {
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'on', this.triggerContainer);
            }
        };
        View.prototype.offEvent = function (selector, event, func) {
            if (this._v.isEmpty(selector)) {
                this.autoHandleEvent('off');
            }
            else {
                //this._e.uninitEvent(selector, event, func);
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'off', this.triggerContainer);
            }
        };
        View.prototype.getController = function () {
            return this.controller;
        };
        View.prototype.getModel = function () {
            return this.model || this.getController().getModel();
        };
        View.hoadEvent = SYST.hoadEvent;
        return View;
    })();
    YT.View = View;
})(YT || (YT = {}));
//# sourceMappingURL=View.js.map