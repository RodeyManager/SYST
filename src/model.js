/**
 * Created by Rodey on 2015/10/16.
 * Model 模型对象
 * @type {Function}
 */

;(function(SYST, root){

    var Model = function(){
        this.__instance_SYST__ = 'SYST Model';
        this.__name__ = 'SYST Model';
        this.autoWatcher = true;
        this.watcher = null;
        this.components = [];
    };

    SYST.Model = function(){
        var args = slice.call(arguments), firstArg = args[0], model, isMid = SYST.V.isString(firstArg);
        isMid && args.splice(0, 1);
        model = SYST.extendClass(args, Model);
        isMid && (model.$mid = firstArg);
        model._initialize();
        return model;
    };

    Model.prototype = {

        _initialize: function(){
            this.$http = this.$http || new SYST.Http();
            this._props = {};

            //helpers
            this.helpers = SYST.V.isFunction(this.helpers) ? this.helpers.apply(this) : this.helpers || {};
            if(SYST.V.isObject(this.helpers)){
                SYST.T.each(this.helpers, function(method, i, name){
                    this.helpers[name] = method.bind(this);
                }, this);
            }
            //属性列表，数据绑定在里面
            this.props = SYST.V.isFunction(this.props) ? this.props.apply(this) : this.props || {};
            this._props = SYST.clone(this.props);
            this.props = {};
            //初始化，将props代理到 $props对象上
            this._$proxyProps();

            Object.defineProperty(this.props, '$M', { value: SYST.shareModel, enumerable: true, writable: true, configurable: false });

            //components
            if(this.components && this.components.length > 0){
                //this._initComponents();
            }

            //初始化 Watcher
            this._getTags();
            this.watcher = new SYST.Watcher(this);
            this.init && this.init.apply(this, arguments);
            SYST.shareModel.add(this.$mid || null, this);
            //var startTime = Date.now();
            if(this.$mid && this.autoWatcher !== false){
                this.watcher.init();
            }
            //console.log((Date.now() - startTime) / 1000);
        },
        $: SYST.$,
        // 在本模型中存取
        get: function(key){
            return this._props[key];
        },
        // 动态添加属性
        set: function(key, value, flag){

            if(SYST.V.isEmpty(key)) return this;

            if(SYST.V.isObject(key)){
                for(var k in key){
                    _set.call(this, k, key[k]);
                }
            }else if(SYST.V.isString(key)){
                _set.call(this, key, value);
            }

            function _set(k, v){
                if(this.has(k)){
                    this._props[k] = v;
                    !flag && this._watchProp(k, v);
                }else{
                    this._props[k] = v;
                    this._$proxyProp(this.props, k);
                    !flag && this._watchAddProp(k, v);
                }

                //if(v && !v.__ob__){
                //    this._observe(v, k);
                //}
            }

            return this;
        },
        add: function(key, value, flag){
            this.set(key, value, flag);
            this.watcher.addListener(key, value);
        },
        refresh: function(key){
            this.set(key, this.get(key));
        },
        //判断某个属性值是否存在
        has: function(key){
            return this.hasProp(key) || this.get[key] != undefined;
        },
        //判断某个属性是否存在
        hasProp: function(key){
            return SYST.V.isObject(this._props) && key in this._props;
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
                this.props = this._props = {};
            }
            return this;

        },
        removePropsAll: function(){
            this.removeProps();
        },
        //动态删除属性
        remove: function(key){
            if(!key || key == '') return this;
            this._props[key] = null;
            delete this._props[key];
            this.watcher.removeListener(key);
            return this;
        },
        // 在localStorage中存取 flag == true 代表 sessionStorage
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

        _initComponents: function(){
            SYST.T.each(this.components, function(component){

            }, this);
        },

        _getTags: function(){
            this.tags = [];
            this.tags = (this.$mid && this.tags.length === 0) && (function($mid){
                var mId = $mid[0] === '#', mClass = $mid[0] === '.';
                if(mId || mClass){
                    return document.querySelectorAll($mid);
                }else{
                    return document.querySelectorAll('[st-model='+ $mid +']');
                }
            })(this.$mid);
        },
        //代理 $props
        //将 props中的属性代理到 $props上，getter and setter
        _$proxyProps: function(){
            SYST.T.each(this._props, function(value, i, key){
                //如果值是数组，或者Oject
                if(value && !value.__ob__){
                    this._observe(value, key);
                }
                this._$proxyProp(this.props, key);
            }, this);
        },
        _$proxyProp: function(object, key){
            var self = this;
            var _object = object || this.props;

            Object.defineProperty(_object, key, {
                configurable: true,
                enumerable: true,
                get: function getterProp(){
                    return self.get(key);
                },
                set: function setterProp(value){
                    if(value && !value.__ob__){
                        self._observe(value, key);
                    }
                    self.set(key, value);
                }
            });
        },
        _observe: function(value, tier){
            SYST.Observe(value, this._watchServe.bind(this), this, tier);
        },
        _watchServe: function(changer){
            //console.log(changer);
            if(!changer.tier){
                changer.type == 'update' && this.set(changer.name, changer.newValue);
            }else{
                if(changer.target[changer.tier]){
                    this._props[changer.tier][changer.name] = changer.newValue;
                }
                changer.type == 'update' && this.watcher.update(changer.tier, this._props[changer.tier]);
            }
        },
        //监听 st-prop 属性变化(已存在)
        _watchProp: function(key, value){
            this.watcher && this.watcher.update(key);
        },
        _watchAddProp: function(key, value){
            this.watcher && this.watcher.add(key, value);
        }

    };

})(SYST, window);