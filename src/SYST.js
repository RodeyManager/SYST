/**
 * Created with JetBrains WebStorm.
 * Author: Rodey Luo
 * Date: 15-6-12
 * Time: 下午1:06
 * To change this template use File | Settings | File Templates.
 * 此框架依赖于: jQuery || Zepto || Ender   依赖于模板插件: Arttemplate || Underscore
 * 使用前请先引入依赖插件
 *
 * requireJS 引入:
 *                  'SYST' : {
                        deps : ['jQuery || Zepto || Ender'],
                        exports: 'SYST'
                    }
 */

;(function(SYST){

    'use strict';

    var root = this;
    var SYST = {};
    (typeof exports !== 'undefined') ? (SYST = exports) : (SYST = root.SYST = {});

    //框架属性
    SYST.version = '0.0.5';
    SYST.author = 'Rodey Luo';
    SYST.name = 'SYST JS MVC mini Framework (JS MVC框架)';

    //解决命名冲突
    SYST.noConflict = function() {
        root.SYST = SYST;
        return this;
    };
    //外置插件 (加载时一定要考虑依赖性)
    //判断是否有jquery，zepto插件
    try{
        SYST.$ = root.jQuery || root.Zepto || root.ender || undefined;
    }catch(e){
        throw new Error('$不存在，请先引入jQuery|Zepto|Ender插件，依赖其中一个。' + e);
    }
    //模板引擎插件，默认使用arttemplate ( https://github.com/aui/artTemplate || www.planeart.cn/?tag=arttemplate )
    //也支持underscore（ _ ）
    try{
        SYST.template = root.template || root._ || undefined;
    }catch(e){
        throw new Error('模板解析对象不存在，请先引入arttemplate|underscore插件，依赖其中一个' + e);
    }

    /**
     * 继承函数
     * @param parent 父对象
     * @param child  子对象
     * @return {*}
     * @private
     */
    var _extend = function(parent, child){
        if(!parent) return child;
        if(!child) return parent;
        if(!child.prototype){
            child.__super__ = parent;
            var proto;
            for(proto in parent){
                if(parent.hasOwnProperty(proto)){
                    child[proto] = parent[proto];
                }
            }
        }
        return child;
    };

    var _clone = function(targetObject){
        var target = targetObject, out = {}, proto;
        for(proto in target){
            if(target.hasOwnProperty(proto)){
                out[proto] = target[proto];
            }
        }
        return out;
    };

    var _hoadEvent = function(obj, func){
        var args = [], self = this;
        obj = obj || window;
        for(var i = 2; i < arguments.length; i++) args.push(arguments[i]);
        return function(e){
            if(e && typeof e === 'object'){
                e.preventDefault();
                e.stopPropagation();
            }
            args.push(e);
            //obj[func].apply(obj, args);
            //保证传递 Event对象过去
            //obj[func].call(obj, e, args);
            if(obj[func])
                obj[func].call(obj, e, args);
            else
                throw new Error(func + ' 函数未定义！');
        }
    };

    SYST.extend = _extend;
    SYST.clone = _clone;
    SYST.hoadEvent = _hoadEvent;

    // RequireJS && SeaJS -----------------------------
    if(typeof define === 'function'){
        define(function() {
            return SYST;
        });
        // NodeJS
    }else if(typeof exports !== 'undefined'){
        module.exports = SYST;
    }

    root.SYST = SYST;


}).call(this);