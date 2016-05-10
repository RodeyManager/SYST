/**
 * Created by Rodey on 2015/10/16.
 *
 * Module 视图对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var View = function(){
        this.__SuperName__ = 'SYST View';
        this.__Name__ = 'SYST View';
    };
    SYST.View = function(){
        var view = SYST.extendClass(arguments, View);
        view._initialize();
        return view;
    };

    View.prototype = {
        container: 'body',
        tagPanel: 'selection',
        _initialize: function(){
            this.container = SYST.$(this.container);
            this.containerSelector = this.container.selector;
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);

            //自定义init初始化
            !this.unInit && this.init && this.init.apply(this, arguments);
            if(this.render && SYST.V.isFunction(this.render)){
                this.$el = SYST.$('<' + this.tagPanel + '/>');
                this.render.apply(this, arguments);
            }

            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && SYST.V.isObject(this.events) &&  this.onEvent();
        },

        destroy: function(){
            this.$el.remove();
            this.container.html('');
            return this;
        },
        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        handEvent: function(callback, value){
            var self = this, args = [];
            for(var i = 2; i < arguments.length; i++)   args.push(arguments[i]);
            return function(e){
                args.push(value);
                args.push(e);
                callback.apply(self, args);
            }
        },
        //处理事件绑定，以改变对象作用域
        hoadEvent: SYST.hoadEvent,
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        _parseEvent: function(evtObj){
            if(!evtObj || evtObj.length == 0 || evtObj === {}) return this;
            var evts = [], objs = [], handleFunctions = [], o, selector, evtType, func;
            for(var evt in evtObj){
                var eobj = evtObj[evt];
                if(SYST.V.isObject(eobj)){
                    for(var k in eobj){
                        o = this._parseString(eobj, k), selector = o[0], evtType = o[1], func = o[2];
                        pushs(selector, evtType, func);
                    }
                }else{
                    o = this._parseString(evtObj, evt), selector = o[0], evtType = o[1], func = o[2];
                    pushs(selector, evtType, func);
                }

            }

            function pushs(selector, evtType, func){
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
        },
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        _autoHandleEvent: function(type){
            var parseEvents = this._parseEvent(this.events),
                evts = parseEvents['events'],
                objs = parseEvents['elements'],
                funs = parseEvents['functions'];
            if(!evts || evts.length == 0 || evts.length == {}) return this;
            var type = type || 'on';
            for(var i = 0, l = evts.length; i < l; i++){
                if(!evts[i])
                    throw new Error('对象侦听'+ evts[i] + '不存在');
                if(!funs[i])
                    throw new Error('对象'+ this + '不存在' + funs[i] + '方法');
                if(!objs[i])
                    throw new Error('事件函数'+ funs[i] + '不存在');

                SYST.Events($(objs[i]), this, evts[i], funs[i], type, this.containerSelector);
            }
            return this;
        },

        _parseString: function(obj, k){
            var o = ($.trim(k)).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType = o[0].replace(/^\s*|\s*$/gi, '');
            var func = obj[k];
            return [selector, evtType, func];
        },

        /**
         * 开始监听
         * @param selector
         * @param event
         * @param func
         */
        onEvent: function(selector, event, func){
            if(SYST.V.isEmpty(selector)) {
                this._autoHandleEvent('on');
            }else{
                SYST.Events.initEvent(SYST.V.isString(selector) ? $(selector) : selector, this, event, func, 'on', this.containerSelector);
            }
            return this;
        },

        /**
         * 结束监听
         * @param selector
         * @param event
         * @param func
         */
        offEvent: function(selector, event, func){
            //this.autoHandleEvent('off');
            if(SYST.V.isEmpty(selector)){
                this._autoHandleEvent('off');
            }else{
                //this._e.uninitEvent(selector, event, func);
                SYST.Events.initEvent(SYST.V.isString(selector) ? $(selector) : selector, this, event, func, 'off', this.containerSelector);
            }
            return this;
        },

        //Function 模板渲染
        template: SYST.T.render,
        //将元素转成对象并返回
        parseDom: SYST.T.parseDom,
        getController: function(){
            return this.controller;
        },
        getModel: function(){
            this.model = this.model || this.getController().getModel() || new SYST.Model();
            return this.model;
        },
        model: new SYST.Model(),
        shareModel: SYST.shareModels
    };

})(SYST, window);