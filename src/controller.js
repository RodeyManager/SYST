;(function(SYST){

    var Controller = function(){
        this.__instance_SYST__ = 'SYST Controller';
        this.__Name__ = 'SYST Controller';
    };
    SYST.Controller = function(){
        var ctrl = SYST.extendClass(arguments, Controller);
        ctrl._initialize();
        return ctrl;
    };
    Controller.prototype = {
        shareModel: SYST.shareModel,
        $: SYST.$,
        _initialize: function(){
            this.defaultHost = this.defaultHost || location.host;
            this.model = SYST.Model();
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
