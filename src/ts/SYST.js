/**
 * Created by Rodey on 2015/10/21.
 */
var SYST = (function () {
    function SYST() {
    }
    SYST.prototype.Model = function (child) {
        return new YT.Model(child);
    };
    SYST.prototype.View = function (child) {
        /*this._view = new YT.View(child);
        return this._view;*/
        //return YT.View.getInstance(child);
        return new YT.View(child);
    };
    SYST.prototype.Controller = function (child) {
        return new YT.Controller(child);
    };
    SYST.prototype.Validate = function (child) {
        return new YT.Validate(child);
    };
    SYST.prototype.Tools = function (child) {
        return new YT.Tools(child);
    };
    SYST.prototype.Router = function () {
        return new YT.Router();
    };
    SYST.noConflict = function () {
        return SYST;
    };
    /**
     * 对象继承
     * @param parent
     * @param child
     * @returns {any}
     */
    SYST.extend = function (parent, child) {
        if (!parent || parent === {} || typeof (parent) !== 'object')
            return child;
        if (!child || child === {} || typeof (child) !== 'object')
            return parent;
        if (!child.prototype) {
            child.__super__ = parent;
            var proto;
            for (proto in parent) {
                if (parent.hasOwnProperty(proto)) {
                    child[proto] = parent[proto];
                }
            }
        }
        return child;
    };
    /**
     * 类继承
     * @param d
     * @param b
     */
    SYST.extendClass = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function Parent() {
            this.constructor = d;
        }
        d['prototype'] = (b === null) ? Object.create(b) : (new Parent());
    };
    /**
     * 对象拷贝
     * @param targetObject
     * @returns {Object}
     */
    SYST.clone = function (targetObject) {
        var target = targetObject, out, proto;
        for (proto in target) {
            if (target.hasOwnProperty(proto)) {
                out[proto] = target[proto];
            }
        }
        return out;
    };
    /**
     * 重置事件监听函数作用域
     * @param object
     * @param func
     * @returns {function(MouseEvent): undefined}
     */
    SYST.hoadEvent = function (object, func) {
        var args = [], self = this;
        var obj = object || window;
        for (var i = 2; i < arguments.length; ++i)
            args.push(arguments[i]);
        return function (e) {
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
    };
    //variables static
    SYST.author = 'Rodey';
    SYST.version = '0.0.5';
    SYST.name = 'SYST JS MVC mini Framework (JS MVC框架)';
    return SYST;
})();
//# sourceMappingURL=SYST.js.map