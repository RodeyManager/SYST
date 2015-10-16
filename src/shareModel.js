/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * Module 共享数据模型
     * @type {Object}
     */
    SYST._shareModels = [];
    var ShareModel = SYST.shareModel = {
        add: function(val){
            SYST._shareModels.push(val);
        },
        get: function(val){
            if(null == val){ return SYST._shareModels; }
            for(var i = 0; i < SYST._shareModels.length; ++i)
                if(val == SYST._shareModels[i])
                    return SYST._shareModels[i];
            return null;
        },
        remove: function(val){
            SYST.T.arrRemove(SYST._shareModels, val);
            return SYST._shareModels;
        },
        has: function(val){
            return SYST.T.indexOf(SYST._shareModels, val) !== -1;
        }
    };

})(SYST);
