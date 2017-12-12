/**
 * Created by Rodey on 2016/9/23.
 * web component 组件
 */

;(function(SYST){

    var Component = function(componentName, options){
        this.cname = componentName;
        this.cmodel = this.cname + '-model';
        this.options = options || {};
        //this._init();
    };

    Component.prototype = {
        _init: function(){
            this.container = SYST.$(this.cname)[0];
            this.template = this.options.template || this.container.html();
            this.container.attr('st-model', this.cmodel);
            this.content = SYST.$(this.template);
            this.container.append(this.content);
            this.model = SYST.Model(this.cmodel, this.options);
            this._implantation();
        },
        _implantation: function(){
            this.container.replace(this.content);
        }
    };

    function _createNode(){
        var node = document.createDocumentFragment();
        return $(node);
    }

    SYST.Component = function(cid, options){
        return new Component(cid, options);
    };

})(SYST);