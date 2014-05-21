/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-1-17
 * Time: 下午4:51
 * To change this template use File | Settings | File Templates.
 */
/**
 * 验证模块
 */
define(['jQuery'], function(){

    var Validate = new Object();
    window.$.Validate = Validate || (Validate = new Object());
    //验证是否是中文
    Validate.isCN = function(str){
        return (/^[\u4e00-\u9fa5]+$/.test(str));
    };
    //验证是否为email地址
    Validate.isEmail = function(email){
        return (/^\w+[-+.]\w+\)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi.test(email));
    };
    /**
     * 验证是否是IP地址
     * @param strIP
     * @return {Boolean}
     */
    Validate.isIP = function(strIP) {
        if (isNull(strIP)) return false;
        var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
        if(re.test(strIP))
        {
            if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true;
        }
        return false;
    };

    /*
     用途：检查输入对象的值是否符合整数格式
     输入：str 输入的字符串
     返回：如果通过验证返回true,否则返回false
     */
    Validate.isInteger = function( str ){
        var regu = /^[-]{0,1}[0-9]{1,}$/;
        return regu.test(str);
    };

    if(App){
        App.validate = Validate;
    }

    return Validate;
});
