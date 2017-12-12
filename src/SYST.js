
window.SYST = window.ST = (function(){

    var SYST = function(){};

    /**
     * 生成或者是继承类对象
     * @param args
     * @param className
     * @returns {*}
     * @private
     */
    var _extendClass = function(args, className){
        var args = Array.prototype.slice.call(args),
            firstArgument = args[0], i = 0, mg = {}, len = args.length;
        var hasProto = '__proto__' in mg;
        if(SYST.V.isObject(firstArgument)){
            //if firstArgument is SYST's Object
            if(len > 1 && '__instance_SYST__' in firstArgument){
                //实现继承
                args.shift();
                for(; i < len; ++i){
                    mg = _extend(mg, args[i]);
                }
                if(!hasProto)
                    mg = _extend(mg, firstArgument);
                else
                    mg.__proto__ = firstArgument;
                return mg;
            }else{
                //直接创建对象
                for(; i < len; ++i){
                    mg = _extend(mg, args[i]);
                }
                if(!hasProto)
                    mg = _extend(mg, className.prototype);
                else
                    mg.__proto__ = new className();
                return mg;
            }
        }else{
            //直接创建原始对象
            if(!hasProto)
                mg = new className();
            else
                mg.__proto__ = new className();
            return mg;
        }
    };

    SYST.ready = function(callback){
        (/complete|loaded|interactive/.test(document.readyState) && document.body)
        ? callback(SYST.$)
        : document.addEventListener('DOMContentLoaded', function(){ callback(SYST.$); }, false);
    };
    SYST.extend = _extend;
    SYST.extendClass = _extendClass;
    SYST.clone = _clone;

    return SYST;

}).call(this);