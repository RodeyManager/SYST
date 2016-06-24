/**
 * Created by Rodey on 2015/10/16.
 *
 * Model 模型对象
 * @type {Function}
 */

;(function(SYST, root){

    'use strict';

    var _$ = SYST.$;
    var isObserve = 'observe' in Object;
    var Model = function(){
        this.__instance_SYST__ = 'SYST Model';
        this.__name__ = 'SYST Model';
        this.autoWatcher = true;
        this.watcher = null;
    };

    SYST.Model = function(){
        var model = SYST.extendClass(arguments, Model);
        model._initialize();
        return model;
    };

    Model.prototype = {

        _initialize: function(){
            this.$http = this.$http || new SYST.Http();
            //属性列表，数据绑定在里面
            this.props = this.props || {};
            //初始化 Watcher
            this.watcher = new SYST.Watcher(this);
            SYST.shareModel.add(this.$mid || null, this);
            this.init && this.init.apply(this, arguments);
            //var startTime = Date.now();
            if(this.$mid || this.autoWatcher !== false){
                this.watcher.init();
            }
            //console.log('Model: ' + this.$mid, (Date.now() - startTime) / 1000)
        },

        /**
         * 根据数组自动生成对象属性
         * @param apis
         */
        generateApi: function(apis, urls, options){
            var self = this;
            SYST.V.isArray(apis) && SYST.T.each(apis, function(key, index){
                self._generateApi(key, urls[key], options);
            });

            if(SYST.V.isObject(apis)){
                for(var key in apis){
                    this._generateApi(key, apis[key], options);
                }
            }
        },

        _generateApi: function(key, url, options){
            var self = this;
            options = SYST.V.isObject(options) && options || {};
            options['callTarget'] = this;
            function _vfn(postData, su, fail){
                self.$http.doAjax(url, postData, su, fail, options);
            }
            ('defineProperty' in Object)
                ? Object.defineProperty(self, key, { value: _vfn })
                : (self[key] = _vfn);

        },

        // 在本模型中存取
        get: function(key){    return this.props[key];    },
        // 动态添加属性
        set: function(key, value){

            if(SYST.V.isEmpty(key)) return this;
            var self = this;

            if(SYST.V.isObject(key)){
                // this.set({ name: 'Rodey', age: 25 });
                for(var k in key){
                    _set(k, key[k]);
                }
            }else if(SYST.V.isString(key) && key.length > 0){
                //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                _set(key, value);
            }

            function _set(k, v){
                self.props[k] = v;
                self._watchProrp(k, v);
            }

            //不是每次设置单个prop都 watcher template
            //而是整个set动作完成之后，执行watcher template
            self._watchTemplate();

            return this;
        },
        add: function(key, value){
            this.set(key, value);
        },
        //判断某个属性是否存在
        has: function(key){
            return Boolean(this.props[key]);
        },
        removeProps: function(keys){
            //var self = this;
            if(SYST.V.isString(keys)){
                this.remove(keys);
            }
            else if(SYST.V.isArray(keys)){
                SYST.T.each(keys, function(key){
                    this.remove(key);
                }, this);
            }else if(SYST.V.isObject(keys)){
                SYST.T.each(keys, function(value, index, key){
                    this.remove(key);
                }, this);
            }else{
                this.watcher.removeListener();
                this.props = {};
            }
            return this;

        },
        removePropsAll: function(){
            this.removeProps();
        },
        //动态删除属性
        remove: function(key){
            if(!key || key == '') return this;
            this.props[key] = null;
            delete this.props[key];
            this.watcher.removeListener(key);
            return this;
        },

        // 在localStorage中存取
        getItem: function(key, flag){
            var item =  (!flag ? root.localStorage : root.sessionStorage).getItem(key);
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
                if(SYST.V.isObject(_v) || SYST.V.isArray(_v)){
                    _v = JSON.stringify(_v);
                }
                (!flag ? root.localStorage : root.sessionStorage).setItem(_k, _v);
            }
        },
        hasItem: function(key, flag){
            return Boolean((!flag ? root.localStorage : root.sessionStorage).getItem(key));
        },
        removeItem: function(key, flag){
            (!flag ? root.localStorage : root.sessionStorage).removeItem(key);
        },
        removeItems: function(keys, flag){
            var self = this;
            if(SYST.V.isString(keys)){
                this.removeItem(keys, flag);
            }
            else if(SYST.V.isArray(keys)){
                SYST.T.each(keys, function(key){
                    this.removeItem(key, flag);
                }, this);
            }else{
                flag ? sessionStorage.clear() : localStorage.clear();
            }
        },

        //监听 st-prop 属性变化
        _watchProrp: function(key, value){
            //if(!isObserve)
                this.watcher && this.watcher.update(key);
        },
        //监听 st-template
        _watchTemplate: function(){
            this.watcher && this.watcher.updateRenderTemplate();
        }

    };

})(SYST, window);