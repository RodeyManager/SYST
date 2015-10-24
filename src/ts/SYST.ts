/**
 * Created by Rodey on 2015/10/21.
 */

class SYST {

        //variables static
        public static author:string = 'Rodey';
        public static version:string = '0.0.5';
        public static name:string = 'SYST JS MVC mini Framework (JS MVC框架)';

        public _model: YT.Model;
        public _view: YT.View;
        public _controller: YT.Controller;
        private _event: YT.Event;
        private _validate: YT.Validate;
        private _tools: YT.Tools;

        public constructor() {
        }

        public Model(child:any):any {
            this._model = new YT.Model(child);
            return this._model;
        }

        public View(child:any):any {
            /*this._view = new YT.View(child);
            return this._view;*/
            return YT.View.getInstance(child);
        }

        public Controller(child:any):any {
            this._controller = new YT.Controller(child);
            return this._controller;
        }

         public Event() {
            this._event = new YT.Event();
            return this._event;
        }

        public Validate() {
            this._validate = new YT.Validate();
            return this._validate;
        }

        public Tools() {
            this._tools = new YT.Tools();
            return this._tools;
        }

        public static noConflict() {
            return SYST;
        }

        /**
         * 对象继承
         * @param parent
         * @param child
         * @returns {any}
         */
        public static extend(parent:any, child:any) {
            if (!parent || parent === {} || typeof(parent) !== 'object') return child;
            if (!child || child === {} || typeof(child) !== 'object') return parent;
            if (!child.prototype) {
                child.__super__ = parent;
                var proto:any;
                for (proto in parent) {
                    if (parent.hasOwnProperty(proto)) {
                        child[proto] = parent[proto];
                    }
                }
            }
            return child;
        }

        /**
         * 类继承
         * @param d
         * @param b
         */
        public static extendClass(d:any, b:any):void {
            for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p];
            function Parent() {
                this.constructor = d;
            }
            d['prototype'] = (b === null) ? Object.create(b) : (new Parent());
        }

        /**
         * 对象拷贝
         * @param targetObject
         * @returns {Object}
         */
        public static clone(targetObject:any):any {
            var target:any = targetObject, out:any, proto:string;
            for (proto in target) {
                if (target.hasOwnProperty(proto)) {
                    out[proto] = target[proto];
                }
            }
            return out;
        }

        /**
         * 重置事件监听函数作用域
         * @param object
         * @param func
         * @returns {function(MouseEvent): undefined}
         */
        public static hoadEvent(object:any, func:any):any {
            var args:Array<any> = [], self:any = this;
            var obj:any = object || window;
            for (var i:number = 2; i < arguments.length; ++i) args.push(arguments[i]);

            return (e?: any) => {
                if (e && typeof e === 'object') {
                    e.preventDefault();
                    e.stopPropagation();
                }
                args.push(e);
                //obj[func].apply(obj, args);
                //保证传递 Event对象过去
                //obj[func].call(obj, e, args);
                if (object[func])
                    object[func].call(object, e, args);
                else
                    throw new Error(func + ' 函数未定义！');
            };
        }
}


