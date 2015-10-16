/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';


    /**
     * Module 控制器对象
     * @type {Function}
     */
    var Controller = SYST.Controller = function(child){
        this.__Name__ = 'Controller';
        this.model = undefined;
        this.superView = undefined;
        this.shareModels = SYST.shareModel.get(null);
        if(child){
            child.__SuperName__ = 'SYST Controller';
            child = SYST.extend(SYST.Controller.prototype, child);
            child._initialize();
            return child;
        }else{
            return new SYST.Controller({});
        }
    };
    SYST.Controller.prototype = {
        defaultHost: location.host,
        shareModel: SYST.shareModel,
        _initialize: function(){
            this.init && this.init.apply(this, arguments);
        },
        getModel: function(key){
            if(key)     return this.shareModel.get(key);
            else        return this.model;
        },
        setModel: function(val){
            if(key !== '' || null != val){
                this.shareModel.add(val);
            }else if(typeof key === 'object'){
                this.model = key;
            }else{
                throw 'setModel: 参数有误';
            }
        }
    };

})(SYST);
