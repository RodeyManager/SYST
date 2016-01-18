/**
 * Created by Rodey on 2015/10/16.
 *
 * Model 模型对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var Model = SYST.Model = function(child){
        this.__Name__ = 'Model';
        if(child){
            child = child || {};
            child.__SuperName__ = 'SYST Model';
            child = SYST.extend(SYST.Model.prototype, child);
            child._initialize();
            return child;
        }else{
            return new SYST.Model({});
        }
    };

    SYST.Model.prototype = {
        _initialize: function(){
            this.init && this.init.apply(this, arguments);
            this.attributes = {};
            SYST.shareModel.add(this);
        },
        // 在本模型中存取
        get: function(key, options){    return this.attributes[key];    },
        set: function(key, value, options){
            if(key == null) return this;
            var attrs, options;
            if(key){
                if(typeof key === 'object'){
                    // this.set({ name: 'Rodey', age: 25 });
                    for(var k in key){
                        this.attributes[k] = key[k];
                    }
                }else if(typeof key === 'string' && key.length > 0){
                    //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                    this.attributes[key] = value;
                }else{
                    return this;
                }
            }
        },
        // 在localStorage中存取
        getItem: function(key, flag){
            var item =  (!flag ? window.localStorage : window.sessionStorage).getItem(key);
            try{
                item = JSON.parse(item);
            } catch(e){}
            return item;
        },
        setItem: function(key, value, flag){
            if(SYST.V.isObject(key)){
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
                if(SYST.V.isObject(_v)){
                    _v = JSON.stringify(_v);
                }
                (!flag ? window.localStorage : window.sessionStorage).setItem(_k, _v);
            }
        },

        //判断某个属性是否存在
        has: function(key){ return Boolean(this.attributes[key]); },
        hasItem: function(key, flag){ return Boolean((!flag ? window.localStorage : window.sessionStorage).getItem(key)); },
        //动态添加属性
        add: function(key, value, options){ this.set(key, value, options); },
        /*addItem: function(key, value, options){ this.setItem(key, value, options) },*/
        //动态删除属性
        remove: function(key){
            if(!key || key == '') return this;
            this.attributes[key] = null;
            delete this.attributes[key];
        },
        removeItem: function(key, flag){ (!flag ? window.localStorage : window.sessionStorage).removeItem(key); },
        removeAll: function(flag){ flag ? (this.attributes = []) : (function(){ window.localStorage.clear(); window.sessionStorage.clear();})() },
        _getName: function(){ return this.__Name__; },
        /**
         * Function 通用AJAX请求方法
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doRequest: function(url, postData, su, fail, options){
            var self = this, type, dataType, setting = {};
            if(!postData || typeof postData !== 'object' || !url || url == '') return;
            //记录当前ajax请求个数
            self._ajaxCount = 0;
            this.ajaxUrl = url;

            if(options){
                type = options.type;
                dataType = options.dataType || self.ajaxDataType || 'json';
                setting = options;
            }else{
                type = self.ajaxType || 'POST';
                dataType = self.ajaxDataType || 'json';
            }
            //提交前触犯
            var rs = before();
            if(rs === false) return;

            var ajaxSetting = SYST.extend(setting, {
                url: url,
                type: type,
                data: postData,
                dataType: dataType,
                success: function(res, data, status, xhr){
                    //console.log('请求成功', res);
                    end(res, data, status, xhr);
                    //如果ajaxSuccess返回false 则将阻止之后的代码运行
                    var rs = success(res, data, status, xhr);
                    rs !== false && SYST.V.isFunction(su) && su.call(self, res, data, status, xhr);
                },
                error: function(xhr, errType){
                    //console.log('请求失败');
                    var response = xhr.response;
                    try{
                        response = JSON.parse(response);
                    }catch (e){}
                    end(response, xhr, errType);
                    //如果ajaxError返回false 则将阻止之后的代码运行
                    var rs = error(response, xhr, errType);
                    rs !== false && SYST.V.isFunction(fail) && fail.call(self, response, xhr, errType);
                },
                complete: function(res, data, status, xhr){
                    //console.log('请求完成');
                    complate(res, data, status, xhr);
                }
            });

            function before(){
                SYST.V.isFunction(self.ajaxBefore) && (setting['beforeSend'] = self.ajaxBefore.apply(self));
                if(setting['beforeSend'] === false) return false;
            }
            function success(res, data, status, xhr){
                var su;
                SYST.V.isFunction(self.ajaxSuccess) && (su = self.ajaxSuccess.call(self, res, data, status, xhr));
                if(su === false) return false;
            }
            function error(res, xhr, errType){
                var err;
                return SYST.V.isFunction(self.ajaxError) && (err = self.ajaxError.call(self, res, xhr, errType));
                if(err === false) return false;
            }
            function complate(res, data, status, xhr){
                var complete;
                return SYST.V.isFunction(self.ajaxComplete) && (complete = self.ajaxComplete.call(self, res, data, status, xhr));
                if(complete === false) return false;
            }
            function end(res, data, status, xhr){
                var end;
                return SYST.V.isFunction(self.ajaxEnd) && (end = self.ajaxEnd.call(self, res, data, status, xhr));
                if(end === false) return false;
            }


            if(root.$){
                root.$.ajax(ajaxSetting);
                self._ajaxCount++;
            }else{
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        },
        /**
         * Function doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        doAjax: function(url, postData, su, fail, options){
            this.doRequest(url, postData, su, fail, options);
        }
    };

})(SYST, window);