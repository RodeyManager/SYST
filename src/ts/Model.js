/**
 * Created by Rodey on 2015/10/21.
 */
/// <reference path="zepto.d.ts" />
var YT;
(function (YT) {
    var Model = (function () {
        function Model(child) {
            this.isInit = true;
            this._attributes = {};
            /**
             * Function 通用AJAX请求方法
             * @param url
             * @param postData
             * @param su
             * @param fail
             */
            this.ajaxDataType = 'json';
            this.ajaxType = 'POST';
            this.ajaxBefore = function () {
            };
            this.ajaxSuccess = function () {
            };
            this.ajaxError = function () {
            };
            this.ajaxComplete = function () {
            };
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            this._v = new YT.Validate();
            this.__Name__ = 'SYST Model';
            if (this.isInit)
                this.init();
        }
        Model.prototype.init = function () {
            console.log('...model init...');
        };
        Model.prototype.set = function (key, value) {
            if (this._v.isEmpty(key))
                return this;
            if (typeof key === 'object') {
                for (var k in key) {
                    this._attributes[k] = key[k];
                }
            }
            else if (typeof key === 'string' && key.length > 0) {
                //this.set('name', 'Rodey') | this.set('one', { name: 'Rodey', age: 25, isBoss: false }
                this._attributes[key] = value;
            }
            else {
                return this;
            }
        };
        Model.prototype.get = function (key) {
            return this._attributes[key];
        };
        // 在localStorage中存取
        Model.prototype.getItem = function (key, flag) {
            var item = (!flag ? window.localStorage : window.sessionStorage).getItem(key);
            try {
                item = JSON.parse(item);
            }
            catch (e) {
            }
            return item;
        };
        Model.prototype.setItem = function (key, value, flag) {
            if (this._v.isObject(key)) {
                for (var k in key) {
                    _set(k, key[k]);
                }
            }
            else if (typeof key === 'string' && key.length > 0) {
                // ('name', 'Rodey') || ('one', { name: 'Rodey', age: 25, isBoss: false });
                _set(key, value);
            }
            else {
                return this;
            }
            function _set(_k, _v) {
                if (this._v.isObject(_v)) {
                    _v = JSON.stringify(_v);
                }
                (!flag ? window.localStorage : window.sessionStorage).setItem(_k, _v);
            }
        };
        //判断某个属性是否存在
        Model.prototype.has = function (key) {
            return Boolean(this._attributes[key]);
        };
        Model.prototype.hasItem = function (key, flag) {
            return Boolean((!flag ? window.localStorage : window.sessionStorage).getItem(key));
        };
        //动态添加属性
        Model.prototype.add = function (key, value) {
            this.set(key, value);
        };
        /*public addItem(key, value, options){ this.setItem(key, value, options) },*/
        //动态删除属性
        Model.prototype.remove = function (key) {
            if (!key || key == '')
                return this;
            this._attributes[key] = null;
            delete this._attributes[key];
        };
        Model.prototype.removeItem = function (key, flag) {
            (!flag ? window.localStorage : window.sessionStorage).removeItem(key);
        };
        Model.prototype.removeAll = function (flag) {
            flag ? (this._attributes = []) : (function () {
                window.localStorage.clear();
                window.sessionStorage.clear();
            })();
        };
        Model.prototype._getName = function () {
            return this.__Name__;
        };
        Model.prototype.doRequest = function (url, postData, su, fail, options) {
            var self = this, type, dataType, setting = {};
            if (!postData || typeof postData !== 'object' || !url || url == '')
                return;
            if (options && this._v.isObject(options)) {
                type = options.type;
                dataType = options.dataType || this.ajaxDataType;
                setting = options;
            }
            else {
                type = this.ajaxType || 'POST';
                dataType = this.ajaxDataType || 'json';
            }
            //提交前触犯
            (this.ajaxBefore && this._v.isFunction(this.ajaxBefore)) && (setting['beforeSend'] = this.ajaxBefore.apply(self));
            var ajaxSetting = SYST.extend(setting, {
                url: url,
                type: type,
                data: postData,
                dataType: dataType,
                success: function (res) {
                    //console.log('请求成功', res);
                    (self.ajaxSuccess && this._v.isFunction(self.ajaxSuccess)) && self.ajaxSuccess.call(self, res);
                    (su && this._v.isFunction(su)) && su.call(self, res);
                },
                error: function (xhr, errType) {
                    //console.log('请求失败');
                    var response = xhr.response;
                    try {
                        response = JSON.parse(response);
                    }
                    catch (e) {
                    }
                    (self.ajaxError && this._v.isFunction(self.ajaxError)) && self.ajaxError.call(self, response, xhr, errType);
                    (fail && this._v.isFunction(fail)) && fail.call(self, response, xhr, errType);
                },
                complete: function (res) {
                    //console.log('请求完成');gulp
                    (self.ajaxComplete && this._v.isFunction(self.ajaxComplete)) && self.ajaxComplete.call(self, res);
                }
            });
            if (root.$) {
                root.$.ajax(ajaxSetting);
            }
            else {
                throw new Error('doRequest: $不存在，此方法依赖于(jQuery||Zepto||Ender)');
            }
        };
        /**
         * Function doRequest 包装
         * @param url
         * @param postData
         * @param su
         * @param fail
         */
        Model.prototype.doAjax = function (url, postData, su, fail, options) {
            this.doRequest(url, postData, su, fail, options);
        };
        return Model;
    })();
    YT.Model = Model;
})(YT || (YT = {}));
//# sourceMappingURL=Model.js.map