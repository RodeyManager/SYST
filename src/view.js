/**
 * Created by Rodey on 2016/10/16.
 * Module 视图对象
 * @type {Function}
 */

;(function(SYST){
    var View = function(){
        this.__instance_SYST__ = 'SYST View';
        this.__Name__ = 'SYST View';
    };
    SYST.View = function(){
        var view = SYST.extendClass(arguments, View);
        view._initialize();
        return view;
    };

    View.prototype = {

        _initialize: function(){
            this.model = this.model || new SYST.Model();
            this.$http = this.$http || new SYST.Http();
            this.container = this.container || 'body';
            this.template = null;
            this.container = SYST.Dom(this.container);
            this._eventCaches_ = {};
            //自动解析 events对象，处理view中的事件绑定
            !this.autoEvent && this.events && SYST.V.isObject(this.events) && this._autoHandleEvent('on');
            //自定义init初始化
            !this.unInit && this.init && this.init.apply(this);
        },
        $: SYST.$,
        destroy: function(){
            this.container.html('');
            this._autoHandleEvent('off');
            return this;
        },
        proxy: SYST.T.proxy,
        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        _parseEvent: function(events){

            if(!SYST.V.isObject(events))    return this;

            _getEvent.call(this, events, 'body');

            function _getEvent(event, container, fn){
                if(SYST.V.isObject(event)){
                    SYST.T.each(event, function(handler, i, evt){
                        if(!SYST.V.isObject(handler)){
                            this._toCache(evt, container, handler);
                        }else{
                            _getEvent.call(this, handler, evt);
                        }
                    }.bind(this));
                }else{
                    this._toCache.call(event, container, fn);
                }
            }

        },
        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        _autoHandleEvent: function(type){
            type = type || 'on';
            if(Object.keys(this._eventCaches_).length === 0){
                this._parseEvent(this.events);
            }

            SYST.T.each(this._eventCaches_, function(events){
                events.length > 0 && SYST.T.each(events, function(event){
                    SYST.Events.initEvent(SYST.Dom(event.selector), event.eventName, this.proxy(this, event.fnName), type, event.container);
                }, this);
            }, this);

        },
        _toCache: function(event, container, fn){
            var flag = false;
            var temp = this._parseString(event),
                caches = this._eventCaches_[temp.eventName];
            if(!temp.eventName)
                throw new Error('对象侦听'+ temp.eventName + '不存在');
            if(!this[fn])
                throw new Error('对象'+ this + '不存在' + fn + '方法');
            if(!temp.selector)
                throw new Error('事件函数'+ temp.selector + '不存在');

            temp.handler = this[fn];
            temp.fnName = fn;
            temp.container = container;

            if(!caches) caches = [];
            caches.length > 0 && SYST.T.each(caches, function(cache){
                if(temp.eventName == cache.eventName
                    && temp.fnName == cache.fnName
                    && temp.container == cache.container
                ){
                    flag = true;
                }else{
                    flag = false;
                }
            });
            !flag && caches.push(temp);
            this._eventCaches_[temp.eventName] = caches;
            return temp;
        },
        _getCache: function(event, container, fn){
            var temp = this._parseString(event), rs;
            SYST.T.each(this._eventCaches_, function(events){
                events.length > 0 && SYST.T.each(events, function(event){
                    if(event.selector == temp.selector && event.fnName == fn && event.container == container && event.handler == this[fn]){
                        rs = event;
                    }
                }, this);
            }, this);
            return rs;
        },
        _parseString: function(event){
            var o = SYST.T.trim(event).split(/\s+/gi);
            var selector = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var eventName = o[0].replace(/^\s*|\s*$/gi, '');
            return { eventName: eventName, selector: selector };
        },
        onEvent: function(event, func, container){
            if(event && func){
                var temp = this._toCache(event, container, func);
                SYST.Events.initEvent(SYST.Dom(temp.selector), temp.eventName, this.proxy(this, temp.fnName), 'on', temp.container);
            }else{
                this._autoHandleEvent('on');
            }
            return this;
        },
        offEvent: function(event, func, container){
            if(event && func){
                var cache = this._getCache(event, container, func);
                cache && SYST.Events.initEvent(SYST.Dom(cache.selector), cache.eventName, this.proxy(this, cache.fnName), 'off', cache.container);
            }else{
                this._autoHandleEvent('off');
            }
            return this;
        },
        shareModel: SYST.shareModels
    };

})(SYST, window);