/**
 * Created by Rodey on 2015/10/21.
 */

module YT {
    export class View {

        public model: YT.Model;
        public controller: YT.Controller;
        public superView: YT.View;
        public isInit:boolean = true;
        public unInit:boolean = false;
        public $el: any;
        public tagPanel: string;
        public events: any;
        public triggerContainer: string;

        private _v: YT.Validate;
        private _t: YT.Tools;
        private _e: YT.Event;
        private _type: string;

        public static hoadEvent: any = ST.hoadEvent;
        private static _self: YT.View;

        public static getInstance(child?: any): YT.View{
            if(this._self) return this._self;
            return new YT.View(child);
        }

        public constructor(child:any) {
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)){
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

        private _initialize(): void{
            this.model = this.model ? this.model : (this.controller ? this.controller.getModel() : undefined);
            //document.body.appendChild(this.$el[0]);
            //自定义init初始化
            this.isInit && this.init && this.init.apply(this, arguments);
            if(this.render){
                var panel = '<' + this.tagPanel + '/>';
                this.$el = $ ? $(panel) : this.parseDom('', panel);
                this.render.apply(this, arguments);
            }

            //自动解析 events对象，处理view中的事件绑定
            this.events && this.events != {} && this._v.isObject(this.events) &&  this.onEvent();
        }

        public init():void {
            console.log('...View init...');
        }

        public render(): void{

        }

        public parseDom(htmlStr: string, tagPanel: any): string{
            return this._t.template(htmlStr, tagPanel);
        }

        /**
         * 格式化 events对象
         * @param events对象
         * @return {*}
         */
        private parseEvent(evtObj: any): any{
            if(!evtObj || evtObj.length == 0 || evtObj === {}) return this;
            var evts: Array<any> = [],
                objs: Array<any> = [],
                handleFunctions: Array<any> = [];
            for(var evt in evtObj){
                var eobj = evtObj[evt];
                if(this._v.isObject(eobj)){
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
        }

        /**
         * 自动绑定事件
         * @param 将被替换的对象
         */
        private autoHandleEvent(type: string){
            var parseEvents = this.parseEvent(this.events),
                evts = parseEvents['events'],
                objs = parseEvents['elements'],
                funs = parseEvents['functions'];
            if(!evts || evts.length == 0 || evts.length == {}) return this;
            var type = type || this._type;
            for(var i = 0, l = evts.length; i < l; i++){
                if(!evts[i])
                    throw new Error('对象侦听'+ evts[i] + '不存在');
                if(!funs[i])
                    throw new Error('对象'+ this + '不存在' + funs[i] + '方法');
                if(!objs[i])
                    throw new Error('事件函数'+ funs[i] + '不存在');

                this._e.initEvent($(objs[i]), this, evts[i], funs[i], type, this.triggerContainer);
            }
            return this;
        }

        private parseString(obj: any, k: string){
            var o = ($.trim(k)).split(/\s+/gi);
            var selector: string = o[1].replace(/^\$*|[\(*]|[\)*]$/gi, '').replace(/"|'/gi, '\"');
            var evtType: string = o[0].replace(/^\s*|\s*$/gi, '');
            var func: string = obj[k];
            return [selector, evtType, func];
        }

        /**
         * 改变对象属性作用域 (常用在元素触发事件侦听函数中)
         * @param callback
         * @param value
         * @return {Function}
         */
        public handEvent(callback: Function, value?: any){
            var self: YT.View = this, args: Array<any> = [];
            for(var i = 2; i < arguments.length; i++)   args.push(arguments[i]);
            return (e?: any) => {
                args.push(value);
                args.push(e);
                callback.apply(self, args);
            }
        }

        public destroy(){
            this.$el.remove && this.$el.remove();
        }

        public onEvent(selector?: any, event?: string, func?: Function){
            if(this._v.isEmpty(selector)) {
                this.autoHandleEvent('on');
            }else{
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'on', this.triggerContainer);
            }
        }

        public offEvent(selector?: any, event?: string, func?: Function){
            if(this._v.isEmpty(selector)){
                this.autoHandleEvent('off');
            }else{
                //this._e.uninitEvent(selector, event, func);
                this._e.initEvent(this._v.isString(selector) ? $(selector) : selector, this, event, func, 'off', this.triggerContainer);
            }

        }

        public getController(){
            return this.controller;
        }
        public getModel(){
            return this.model || this.getController().getModel();
        }

    }
}
