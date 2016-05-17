/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    var evts = "abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting cut copy paste".split(/\s+/gi);

    var _hoadEvent = SYST.T.hoadEvent;

    function _listener(obj, pobj, evt, func, type, trigger){
        var type = type || 'on';
        if(!obj) obj = window;

        //对象事件侦听
        for(var i = 0; i < evts.length; i++){
            if(evts[i] === evt){
                if(obj.selector == window || obj.selector == 'window'){
                    (type == 'on')
                        ? $(window).off().on(evt, _hoadEvent(pobj, func))
                        : $(window).off(evt, SYST.hoadEvent(pobj, func));
                }else if(obj.selector == document || obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body'){
                    (type == 'on')
                        ? $(obj.selector).off().on(evt, _hoadEvent(pobj, func))
                        : $(obj.selector).off(evt, _hoadEvent(pobj, func));
                }else{
                    (type == 'on')
                        ? $(trigger || 'body').undelegate(obj.selector, evt, _hoadEvent(pobj, func))
                        .delegate(obj.selector, evt, _hoadEvent(pobj, func))
                        : $(trigger || 'body').undelegate(obj.selector, evt);
                }
            }
        }

    }

    /**
     * Module 事件处理（ 事件绑定 ）
     * @obj     事件侦听对象
     * @pobj    this作用域被替换对象
     * @evt     事件名称
     * @func    事件函数
     * @type {Function}
     */
    var Events = function(obj, pobj, evt, func, type, trigger){
        _listener(obj, pobj, evt, func, type, trigger);
    };
    // static
    Events.initEvent = function(obj, pobj, evt, func, type, trigger){
        _listener(obj, pobj, evt, func, type, trigger);
    };
    Events.uninitEvent = function(selector, event, func, trigger){
        if (selector == window || selector == 'window') {
            $(window).off(event, func);
        } else if (selector == document || selector == 'document' || selector == 'html' || selector == 'body') {
            $(selector).off(event, func);
        } else {
            $(trigger).undelegate(selector, event, func);
        }
    };

    SYST.Events = Events;

})(SYST);
