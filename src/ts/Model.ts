/**
 * Created by Rodey on 2015/10/21.
 */

/// <reference path="zepto.d.ts" />

module YT {
    export class Model {

        public view: YT.View;
        public controller: YT.Controller;
        public isInit:boolean = true;
        public ajax: YT.Ajax;
        private _attributes: any = {};
        private _v: YT.Validate;
        private __Name__: string;

        public constructor(child?:any) {
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)){
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }

            this.ajax = new YT.Ajax();
            this._v = new YT.Validate();
            this.__Name__ = 'SYST Model';

            if (this.isInit)
                this.init();
        }

        public init():void {
            //console.log('...model init...');
        }

        public set(key: string, value: any): any{
            if(this._v.isEmpty(key)) return this;

            if(typeof key === 'object'){
                // this.set({ name: 'Rodey', age: 25 });
                for(var k in <Object>key){
                    this._attributes[k] = key[k];
                }
            }else if(typeof key === 'string' && key.length > 0){
                //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                this._attributes[key] = value;
            }else{
                return this;
            }
        }

        public get(key): any{
            return this._attributes[key];
        }

        // 在localStorage中存取
        public getItem(key: string, flag?: boolean){
            var item =  (!flag ? window.localStorage : window.sessionStorage).getItem(key);
            try{
                item = JSON.parse(item);
            } catch(e){}
            return item;
        }

        public setItem(key: any , value: any, flag?: boolean){
            if(this._v.isObject(key)){
                // ({ name: 'Rodey', age: 25, phone: { name: 'iphone 5s', prize: 5000 } });
                for(var k in key){
                    _set(k, key[k]);
                }
            }else if(typeof key === 'string' && key.length > 0){
                // ('name', 'Rodey') || ('one', { name: 'Rodey', age: 25, isBoss: false });
                _set(key, value);
            }else{
                return this;
            }
            function _set(_k, _v){
                if(this._v.isObject(_v)){
                    _v = JSON.stringify(_v);
                }
                (!flag ? window.localStorage : window.sessionStorage).setItem(_k, _v);
            }
        }

        //判断某个属性是否存在
        public has(key: string){
            return Boolean(this._attributes[key]);
        }
        public hasItem(key: string, flag?: boolean){
            return Boolean((!flag ? window.localStorage : window.sessionStorage).getItem(key));
        }
        //动态添加属性
        public add(key: string, value: any){
            this.set(key, value);
        }
        /*public addItem(key, value, options){ this.setItem(key, value, options) },*/
        //动态删除属性
        public remove(key: string){
            if(!key || key == '') return this;
            this._attributes[key] = null;
            delete this._attributes[key];
        }
        public removeItem(key: string, flag){
            (!flag ? window.localStorage : window.sessionStorage).removeItem(key);
        }
        public removeAll(flag){
            flag ? (this._attributes = []) : (function(){ window.localStorage.clear(); window.sessionStorage.clear();})()
        }
        public _getName(){
            return this.__Name__;
        }


        /**
         * Function 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */

        public ajaxDataType: string     = 'json';
        public ajaxType: string         = 'POST';
        public ajaxBefore: Function     = function(){};
        public ajaxSuccess: Function    = function(){};
        public ajaxError: Function      = function(){};
        public ajaxComplete: Function   = function(){};
        public ajaxEnd: Function        = function(){};

        public doRequest(url: string, postData: any, su: Function, fail?: Function, options?: any){
            var self: YT.Model = this,
                type: string,
                dataType: string,
                setting: any = {};

            if(!postData || typeof postData !== 'object' || !url || url == '') return;

            if(options && this._v.isObject(options)){
                type = options.type;
                dataType = options.dataType || this.ajaxDataType;
                setting = options;
            }else{
                type = this.ajaxType || 'POST';
                dataType = this.ajaxDataType || 'json';
            }
            //提交前触犯
            var rs = before();
            if(rs === false) return;

            var ajaxSetting: any = ST.extend(setting, {
                url: url,
                type: type,
                data: postData,
                dataType: dataType,
                success: function(res, data, status, xhr){
                    //console.log('请求成功', res);
                    end(res, data, status, xhr);
                    //如果ajaxSuccess返回false 则将阻止之后的代码运行
                    var rs: boolean = success(res, data, status, xhr);
                    rs !== false && this._v.isFunction(su) && su.call(self, res, data, status, xhr);
                },
                error: function(xhr, errType){
                    //console.log('请求失败');
                    var response: any = xhr.response;
                    try{
                        response = JSON.parse(response);
                    }catch (e){}
                    end(response, xhr, errType, null);
                    //如果ajaxError返回false 则将阻止之后的代码运行
                    var rs: boolean = error(response, xhr, errType);
                    rs !== false && this._v.isFunction(fail) && fail.call(self, response, xhr, errType);
                },
                complete: function(res, data, status, xhr){
                    //console.log('请求完成');gulp
                    this._v.isFunction(self.ajaxComplete) && self.ajaxComplete.call(self, res, data, status, xhr);
                }
            });

            function before(){
                this._v.isFunction(self.ajaxBefore) && (setting['beforeSend'] = self.ajaxBefore.apply(self));
                if(setting['beforeSend'] === false) return false;
            }
            function success(res: any, data: any, status: any, xhr: any){
                var su: any;
                this._v.isFunction(self.ajaxSuccess) && (su = self.ajaxSuccess.call(self, res, data, status, xhr));
                if(su === false) return false;
            }
            function error(res: any, xhr: any, errType: any){
                var err: any;
                return this._v.isFunction(self.ajaxError) && (err = self.ajaxError.call(self, res, xhr, errType));
                if(err === false) return false;
            }
            function complate(res: any, data: any, status: any, xhr: any){
                var complete: any;
                return this._v.isFunction(self.ajaxComplete) && (complete = self.ajaxComplete.call(self, res, data, status, xhr));
                if(complete === false) return false;
            }
            function end(res: any, data: any, status: any, xhr: any){
                var end: any;
                return this._v.isFunction(self.ajaxEnd) && self.ajaxEnd.call(self, res, data, status, xhr);
                if(end === false) return false;
            }

            if(window['$']){
                window['$'].ajax(ajaxSetting);
            }else{
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        }
        /**
         * Function doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        public doAjax(url: string, postData: any, su: Function, fail?: Function, options?: any){
            this.doRequest(url, postData, su, fail, options);
        }

        /**
         * 根据数组自动生成对象属性
         * @param apis
         */
        public generateApi(apis, urls){
            var self = this;
            this._v.isArray(apis) && apis.forEach(function(key){
                Object.defineProperty(self, key, { value: function(postData, su, fail){
                    self.doAjax(urls[key], postData, su, fail);
                } });
            });
        }

    }
}