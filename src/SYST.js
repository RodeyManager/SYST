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

;(function(root){

    'use strict';

    var SYST = {}; //function(){};

    //框架属性
    SYST.VERSION = '{{@version}}';
    SYST.AUTHOR = 'Rodey Luo';

    //判断是否有jquery，zepto插件
    try{
        SYST.$ = root.jQuery || root.Zepto || undefined;
    }catch(e){
        throw new Error('$不存在，请先引入jQuery|Zepto插件，依赖其中一个。' + e);
    }

    var _clone = function(targetObject){
        var target = targetObject, out = {}, proto;
        for(proto in target)
            if(target.hasOwnProperty(proto))
                out[proto] = target[proto];
        return out;
    };

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
        var clone = _clone(parent);
        for(var prop in child)
            if(child.hasOwnProperty(prop))
                clone[prop] = child[prop];
        return clone;
    };

    /**
     * 生成或者是继承类对象
     * @param args
     * @param className
     * @returns {*}
     * @private
     */
    var _extendClass = function(args, className){
        var args = Array.prototype.slice.call(args),
            firstArgument = args[0], i = 0, mg = {}, len;
        if(SYST.V.isObject(firstArgument)){
            //if firstArgument is SYST's Object
            if('__instance_SYST__' in firstArgument){
                args.shift();
                for(len = args.length; i < len; ++i){
                    mg = SYST.extend(mg, args[i]);
                }
                mg.__proto__ = firstArgument;
                return mg;
            }else{
                for(len = args.length; i < len; ++i){
                    mg = SYST.extend(mg, args[i]);
                }
                mg.__proto__ = new className();
                return mg;
            }
        }else{
            return mg.__proto__ = new className();
        }
    };

    SYST.extend = _extend;
    SYST.extendClass = _extendClass;
    SYST.clone = _clone;

    //Object.keys
    !('keys' in Object) && (Object.keys = function(o){
        if(o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k = [], p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
        return k;
    });

    if( typeof module === 'object' && typeof module.exports === 'object' ){
        module.exports = SYST;
    }else{
        root.SYST = SYST;
    }

    return SYST;

}).call(this, window);