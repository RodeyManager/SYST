
var slice = Array.prototype.slice,
    toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty;

function empty(){}
function def(target, key, val){
    Object.defineProperty(target, key, {
        value: val,
        enumerable: false,
        writable: true,
        configurable: false
    });
}

function isEnumerable(target, prop){
    var p = Object.getOwnPropertyDescriptor(target, prop);
    return p && p.enumerable === false;
}

var _clone = function(targetObject){
    var target = targetObject, out = {}, proto;
    for(proto in target)
        if(target.hasOwnProperty(proto))
            out[proto] = target[proto];
    return out;
};

var _extend = function(parent, child){
    parent = parent || {};
    child = child || {};
    var clone = _clone(parent);
    for(var prop in child)
        //if(child.hasOwnProperty(prop))
        clone[prop] = child[prop];
    return clone;
};

//Object.keys polyfill
(!Object.keys) && (Object.keys = function(o){
    if(o !== Object(o))
        throw new TypeError('Object.keys called on a non-object');
    var k = [], p;
    for(p in o) if(hasOwnProperty.call(o, p)) k.push(p);
    return k;
});
(!Object.values) && (Object.values = function(o){
    if(o !== Object(o))
        throw new TypeError('Object.keys called on a non-object');
    var k = [], p;
    for(p in o) if(hasOwnProperty.call(o, p)) k.push(o[p]);
    return k;
});
//Function bind polyfill see: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
if(!Function.prototype.bind){
    Function.prototype.bind = function(oThis){
        if(typeof this !== 'function')
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        var aArgs   = slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function(){},
            fBound  = function(){
                return fToBind.apply(this instanceof fNOP
                        ? this : oThis,
                    aArgs.concat(slice.call(arguments)));
            };
        if(this.prototype)
            fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

