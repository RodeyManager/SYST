;(function(SYST){

    function _listener(obj, evt, handler, type, trigger){
        if(!evt) throw new ReferenceError('Event name is must');
        var type = type || 'on';
        if(!obj) obj = window;

        //对象事件侦听
        if(_isWindow(obj.selector)){
            (type == 'on')
                ? SYST.Dom(window).off().on(evt, handler)
                : SYST.Dom(window).off(evt, handler);
        }else if(_isBuilt(obj.selector)){
            (type == 'on')
                ? SYST.Dom(obj.selector).off().on(evt, handler)
                : SYST.Dom(obj.selector).off(evt, handler);
        }else{
            var delegate = SYST.Dom(trigger || 'body');
            if(SYST.V.isArray(delegate)){
                SYST.T.each(delegate, function(dgt){
                    (type == 'on')
                        ? dgt.undelegate(obj.selector, evt, handler)
                            .delegate(obj.selector, evt, handler)
                        : dgt.undelegate(obj.selector, evt, handler);
                });
            }else{
                (type == 'on')
                    ? delegate.undelegate(obj.selector, evt, handler)
                        .delegate(obj.selector, evt, handler)
                    : delegate.undelegate(obj.selector, evt, handler);
            }
        }
    }

    function _addListener(obj, evt, func, type, trigger){
        if(!obj)    return;
        if(SYST.V.isArray(obj)){
            SYST.T.each(obj, function(dom){
                _listener(dom, evt, func, type, trigger);
            }, this);
        }else{
            _listener(obj, evt, func, type, trigger);
        }
    }

    function _isBuilt(selector){
        return selector == document || selector == 'document' || selector == 'html' || selector == 'body';
    }

    function _isWindow(selector){
        return selector == window || selector == 'window';
    }

    /**
     * Module 事件处理（ 事件绑定 ）
     * @obj     事件侦听对象
     * @context    this作用域被替换对象
     * @evt     事件名称
     * @func    事件函数
     * @type {Function}
     */
    var Events = function(obj, evt, func, type, trigger){
        _addListener(obj, evt, func, type, trigger);
    };
    // static
    Events.initEvent = function(obj, evt, func, type, trigger){
        _addListener(obj, evt, func, type, trigger);
    };
    Events.cache = {};
    Events._cache = {};

    SYST.Events = Events;

})(SYST);
