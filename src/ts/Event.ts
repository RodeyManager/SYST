/**
 * Created by Rodey on 2015/10/21.
 */

    /// <reference path="zepto.d.ts" />
module YT{
    export class Event {

        private self: YT.Event;
        private type:string;
        private obj:any;
        private pobj:any;
        private evt:any;
        private func: any;
        private trigger:any;
        static evts:Array<string> = 'abort reset click dblclick tap touchstart touchmove touchend change mouseover mouseout mouseup mousedown mousemove mousewheel drag dragend dragenter dragleave dragover dragstart drop resize scroll submit select keydown keyup keypress touchstart touchend load unload blur focus contextmenu formchange forminput input invalid afterprint beforeprint beforeonload haschange message offline online pagehide pageshow popstate redo storage undo canplay canplaythrough durationchange emptied ended loadeddata loadedmetadata loadstart pause play playing progress ratechange readystatechange seeked seeking stalled suspend timeupdate volumechange waiting cut copy paste'.split(/\s+/gi);

        public constructor() {
            this.trigger = 'body';
            this.type = 'on';
        }

        private hoadEvent: Function = ST.hoadEvent;

        /**
         * 事件侦听
         * @param obj   当前对象
         * @param pobj  父对象
         * @param evt   事件名
         * @param func  事件回调
         * @param type  类型 on: 侦听; off: 卸载
         * @param trigger   代理元素
         */
        public initEvent(obj: any, pobj: any, evt: any, func: any, type: string, trigger: any):void {
            this.self = this;
            this.obj = obj;
            this.pobj = pobj;
            this.evt = evt;
            this.func = func;
            this.type = type || this.type;
            this.trigger = trigger || this.trigger;

            var evts: any = YT.Event.evts;
            if(this.type === 'off'){
                this.uninitEvent(obj.selector, evt, func);
            }

            //对象事件侦听
            for (var i = 0; i < evts.length; i++) {
                if (evts[i] === evt) {
                    if (obj.selector == 'window') {
                        (type == 'on')
                            ? $(window).off().on(evt, this.hoadEvent(pobj, func))
                            : $(window).off();
                    } else if (obj.selector == 'document' || obj.selector == 'html' || obj.selector == 'body') {
                        (type == 'on')
                            ? $(obj.selector).off().on(evt, this.hoadEvent(pobj, func))
                            : $(obj.selector).off();
                    } else {
                        (type == 'on')
                            ? $(this.trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func))
                                        .delegate(obj.selector, evt, this.hoadEvent(pobj, func))
                            : $(this.trigger).undelegate(obj.selector, evt, this.hoadEvent(pobj, func));
                    }
                }
            }
        }

        /**
         * 卸载事件
         * @param selector  元素
         * @param event     事件名
         * @param func      事件回调
         */
        public uninitEvent(selector: any, event?: any, func?: any): void{
            if (selector == 'window') {
                $(window).off(event, func);
            } else if (selector == 'document' || selector == 'html' || selector == 'body') {
                $(selector).off(event, func);
            } else {
                $(this.trigger).undelegate(selector, event, func);
            }
        }

    }
}
