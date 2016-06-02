/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';


    /**
     * Module 控制器对象
     * @type {Function}
     */

    var Controller = function(){
        this.__instance_SYST__ = 'SYST Controller';
        this.__Name__ = 'SYST Controller';
    };
    SYST.Controller = function(){
        var ctrl = SYST.extendClass(arguments, Controller);
        ctrl._initialize();
        return ctrl;
    };
    SYST.Controller.prototype = {
        defaultHost: location.host,
        shareModel: SYST.shareModel,
        _initialize: function(){
            SYST.V.isFunction(this.init) && this.init.apply(this, arguments);
        },
        getModel: function(key){
            if(key)     return this.shareModel.get(key);
            else        return this.model;
        },
        setModel: function(model){
            if(!SYST.V.isEmpty(model)){
                this.shareModel.add(model);
                this.model = model;
            }else{
                throw new Error('setModel: 参数有误');
            }
        }
    };

})(SYST);
