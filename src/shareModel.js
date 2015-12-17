/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * Module 共享数据模型
     * @type {Object}
     */
    SYST._shareModels = {};
    var ShareModel = SYST.shareModel = {
        add: function(key, model){
            SYST._shareModels[key] = model;
        },
        get: function(key){
            var shareModels = SYST._shareModels;
            if(null == key){
                return shareModels;
            }
            if(shareModels[key])
                    return shareModels[key];
            return null;
        },
        remove: function(key){
            var shareModels = SYST._shareModels,
                model = shareModels[key];
            if(model){
                SYST._shareModels[key] = null;
                delete SYST._shareModels[key];
            }
            return model;
        },
        has: function(key){
            return SYST._shareModels[key];
        }
    };

})(SYST);
