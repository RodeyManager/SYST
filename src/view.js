/**
 * Created by Rodey on 2015/10/16.
 *
 * Module 视图对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var View = SYST.View = function(child){
        this.__Name__ = 'View';
        if(child){
            child.__SuperName__ = 'SYST View';
            child = SYST.extend(SYST.View.prototype, child);
            !child.unInit && child._initialize();
            return child;
        }else{
            return new SYST.View({});
        }
    };

    SYST.View.prototype = {
        $el: {},
        tagPanel: 'selection',
        _initialize: function(){
            var self = this;
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.init && this.init.apply(this, arguments);
            if(this.render){
                var panel = '<' + self.tagPanel + '/>';
                self.$el = SYST.$ ? SYST.$(panel) : self.parseDom('', panel);
                self.render.apply(self, arguments);
            }

            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && SYST.V.isObject(this.events) &&  this.onEvent();


        },

        destroy: function(){
            this.$el.remove();
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
        parseEvent: function(evtObj){
            if(!evtObj || evtObj.length == 0 || evtObj === {}) return this;
            var evts = [], objs = [], handleFunctions = [];
            for(var evt in evtObj){
                var eobj = evtObj[evt];
                if(SYST.V.isObject(eobj)){
                    for(var k in eobj){
                        var o = this.parseString(eobj, k), selector = o[0], evtType = o[1], func = o[2];
                        pushs(selector, evtType, func);
                    }
                }else{
                    var o = this.parseString(evtObj, evt), selector = o[0], evtType = o[1], func = o[2];
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
        autoHandleEvent: function(type){
            var parseEvents = this.parseEvent(this.events),
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

                SYST.Events($(objs[i]), this, evts[i], funs[i], type, this.triggerContainer || 'body');
            }
            return this;
        },

        parseString: function(obj, k){
            var o = ($.trim(k)).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType = o[0].replace(/^\s*|\s*$/gi, '');
            var func = obj[k];
            return [selector, evtType, func];
        },

        onEvent: function(){
            this.autoHandleEvent('on');
        },

        offEvent: function(){
            this.autoHandleEvent('off');
        },

        /**
         * Function 模板渲染
         * @param htmlStr
         * @param data
         * @return {*}
         */
        template: function(htmlStr, data){
            var compHtml, render;
            if(root.template){  //采用arttemplate编译
                render = SYST.template.compile(htmlStr);
                compHtml = render(data);
                return compHtml
            }else if(root._){  //采用underscore编译
                compHtml = _.template(htmlStr, data);
            }else{             // 如果模板插件不存在，则直接返回jQuery或者浏览器标准对象
                compHtml = SYST.Render(htmlStr, data);
            }
            return compHtml;
        },
        //将元素转成对象并返回
        parseDom: function(htmlStr, tagPanel){
            return SYST.T.template(htmlStr, tagPanel);
        },
        getController: function(){
            return this.controller;
        },
        getModel: function(){
            return this.model || this.getController().getModel();
        },
        shareModel: SYST.shareModels
    };

})(SYST, window);