/**
 * Created by r9luox on 2016/11/7.
 * Object.observe
 */
;(function(SYST){

    var Observe = function(value, target){
        this.value = value;
        this.type = 'none'; // add update delete none
        this.name = null;
        this.oldValue = null;
        this.object = this.value;
        this.changer = {
            type: 'none',
            name: null,
            oldValue: null,
            newValue: null,
            object: this.value,
            target: this,
            tier: ''
        };
        this.target = target;
        !this.__ob__ && (this.__ob__ = this);
        def(this.value, '__ob__', this);
        this.bindNodes = [];
        this._init();
    };

    Observe.prototype = {
        onWatch: function(cb){
            this.callback = cb;
        },
        _init: function(){
            this._setOldValue(this.value);
        },
        _defineded: function(target, key, value){
            var self = this;
            var defConfig = Object.getOwnPropertyDescriptor(target, key);
            if(defConfig && defConfig.configurable === false){
                return false;
            }
            var _getter = defConfig && defConfig.get;

            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: function getter(){
                    var old = _getter ? _getter.call(this) : self._oldValue[key];
                    if(SYST.V.isArray(old)){
                        if(!old.__ob__){
                            self._inJectMethods(old, key);
                            old.__ob__ = self;
                        }
                    }
                    return old;
                },
                set: function setter(newValue){
                    var old = value || self._oldValue[key];
                    if(newValue === old){
                        self._setChanger('none', key, newValue);
                    }else{
                        self._setChanger('update', key, newValue, old);
                        self._oldValue[key] = newValue;
                    }
                }
            });
        },
        addNode: function(node){
            this.bindNodes.push(node);
        },
        added: function(key, val){
            this._setChanger('add', key, val);
        },
        deleted: function(key){
            this._setChanger('delete', key);
        },
        update: function(key, val){
            this._setChanger('update', key, val);
        },
        none: function(key, val){
            this._setChanger('none', key, val);
        },
        _setChanger: function(type, name, val, old){
            this.changer.type = type;
            this.changer.name = name;
            this.changer.oldValue = old;
            this.changer.newValue = val;
            this.changer.tier = this.value['__tier__'] || this.value[name]['__tier__'] || '';
            if(SYST.T.indexOf(['add', 'update'], type) > -1){
                SYST.Observe(val, this.callback, this.target);
            }
            this._callback();
        },
        _callback: function(){
            var fn = SYST.V.isFunction(this.callback) ? this.callback : function(){};
            fn.call(this.target || this, this.changer);
        },
        _setOldValue: function(value){
            this._oldValue = {};
            if(SYST.V.isObject(value)){
                for(var k in value){
                    this._oldValue[k] = value[k];
                    this._defineded(this.value, k);
                }
            }
            else if(SYST.V.isArray(value)){
                this._inJectMethods(value, this.tier || value['__tier__']);
            }

        },
        /**
         * 对数组对象进行操作，自动更新
         * @param array
         * @param key
         * @returns {*}
         * @private
         * array.push(item)、array.pop(item)...
         */
        _inJectMethods: function(array, key){
            var self = this;
            var props = Array.prototype;
            var methods = ['pop', 'shift', 'unshift', 'push', 'splice', 'sort', 'reverse'];
            //update(args)
            def(array, 'update', function(){
                self.target.props[key] = this;
            });
            SYST.T.each(methods, function(method){
                def(array, method, function(){
                    var args = props.slice.call(arguments);
                    var rs = props[method].apply(array, args);
                    this.update();
                    return rs;
                });
            }, this);
            def(array, 'getIndex', function(val, key){
                for(var i = 0, len = this.length; i < len; ++i){
                    if(val == this[i][key]){
                        return i;
                    }
                }
                return -1;
            });
            def(array, 'set', function(index, val){
                this[index] = val;
                this.update();
            });
            // query(value, key)
            def(array, 'query', function(val, key){
                if(SYST.V.isNumber(val) && !key){
                    return this[val];
                }
                var index = -1;
                SYST.T.each(this, function(item, i){
                    if(val == item[key]){
                        index = i;
                    }
                });
                return index > -1 ? this[index] : null;
            });
            //insert(index, item)
            def(array, 'insert', function(index, item){
                if(!SYST.V.isNumber(index)){
                    this.unshift(index);
                }else{
                    var args = [index, 0].concat(props.slice.call(arguments, 1));
                    this.splice.apply(this, args);
                }
                return this;
            });
            //remove(item)
            //remove(value, key)
            def(array, 'remove', function(item, key){
                if(SYST.V.isNumber(item)){
                    return this.splice.apply(this, [item, key || 1]);
                }
                var index = -1;
                if(!key){
                    index = SYST.T.indexOf(this, item);
                }else{
                    SYST.T.each(this, function(val, i, k){
                        if(item[key] == val[key]){
                            index = i;
                        }
                    });
                }
                if(index > -1){
                    this.splice.apply(this, [index, 1]);
                }
                return this;
            });
            return array;
        }
    };

    SYST.Observe = function(value, cb, target, tier){
        if(value && value['__ob__']) return;

        if(SYST.V.isObject(value) || SYST.V.isArray(value)){
            _toWatch(value, tier);
        }

        function _toWatch(v, tier){
            _setTier(v, tier);
            var _observe = new Observe(v, target || v);
            _observe.onWatch(cb);
        }

        function _setTier(obj, tier){
            def(obj, '__tier__', tier);
        }

    };

})(SYST);

