/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * Module 共享数据模型
     * @type {Object}
     */
    var ShareModel = SYST.shareModel = {
        models: {},
        add: function(key, model){
            if(SYST.V.isEmpty(key)){
                key = (new Date()).getTime() + Math.random();
            }
            this.models[key] = model;
        },
        get: function(key){
            var shareModels = this.models;
            if(shareModels[key])
                return shareModels[key];
            return null;
        },
        remove: function(key){
            var shareModels = this.models,
                model = shareModels[key];
            if(model){
                shareModels[key] = null;
                delete shareModels[key];
            }
            return model;
        },
        has: function(key){
            return this.models[key] ? true : false;
        }
    };

})(SYST);
