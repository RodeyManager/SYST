/**
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Event = (function () {
        function Event() {
            this.hoadEvent = SYST.hoadEvent;
            this.trigger = 'body';
            this.type = 'on';
        }
        Event.prototype.initEvent = function (obj, pobj, evt, func, type, trigger) {
            this.self = this;
            this.obj = obj;
            this.pobj = pobj;
            this.evt = evt;
            this.func = func;
            this.type = type || this.type;
            this.trigger = trigger || this.trigger;
            var evts = YT.Event.evts;
            for (var i = 0; i < evts.length; i++) {
                if (evts[i] === evt) {
                    if (obj.selector == 'window') {
                        (type == 'on') ? $(window).off().on(evt, this.hoadEvent(pobj, func)) : $(window).off();
                    }
                    else if (obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body') {
                        (type == 'on') ? $(obj.selector).off().on(evt, this.hoadEvent(pobj, func)) : $(obj.selector).off();
                    }
                    else {
                        (type == 'on') ? $(trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func)).delegate(obj.selector, evt, this.hoadEvent(pobj, func)) : $(trigger).undelegate();
                    }
                }
            }
        };
        Event.prototype.uninitEvent = function (selector, event, func) {
            if (selector == 'window') {
                $(window).off(event, func);
            }
            else if (selector == 'document' || selector == 'html' || selector == 'body') {
                (type == 'on');
                $(selector).off(event, func);
            }
            else {
                $(this.trigger).undelegate(selector, event, func);
            }
        };
        Event.evts = 'abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting cut copy paste'.split(/\s+/gi);
        return Event;
    })();
    YT.Event = Event;
})(YT || (YT = {}));
//# sourceMappingURL=Event.js.map