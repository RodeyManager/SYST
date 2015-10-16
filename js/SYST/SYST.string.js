/**
 * Created by Rodey on 2015/10/9.
 * Array Functions
 */

;(function(){

    /**
     * 取随机字符串
     * @param len: 长度
     * @param flag: 是否去除扰乱视线
     */
    function randomString (len, flag) {
        var s = 65, e = 122, i = 0, l = len, r, rs = '',
            filter = [91, 92, 93, 94, 95, 96],
            //去除扰乱视线 I L l o O
            f2 = [73, 76, 79, 108, 111];
        for( ; i < l; ++i ){
            r = Math.floor(Math.random() * s + Math.random() * e);
            if(r >= s && r <= e && filter.indexOf(r) === -1){
                if(flag === true)   (f2.indexOf(r) === -1) ? rs += String.fromCharCode(10, r) : l++;
                else                rs += String.fromCharCode(10, r);
            }else{
                l++;
            }
        }
        return rs.replace(/[\n\t\r]*/mgi, '');
    }

    /**
     * 取随机数字
     * @param len: 长度
     */
    function randomNumber(len){
        var s = 48, e = 57, i = 0, l = len, r, rs = '';
        for( ; i < l; ++i ){
            r = Math.floor(Math.random() * s + Math.random() * e);
            (r >= s && r <= e) ? rs += String.fromCharCode(10, r) : l++;
        }
        return rs.replace(/[\n\t\r]*/mgi, '');
    }

    /**
     * 取随字符(包括数字和字母)
     * @param len: 长度
     */
    function randomChar(len, flag){
        var s = 48, e = 122, i = 0, l = len, r, rs = '',
            filter = [58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96],
        //去除扰乱视线 I L l o O
            f2 = [48, 49, 73, 76, 79, 108, 111];
        for( ; i < l; ++i ){
            r = Math.floor(Math.random() * s + Math.random() * e);
            if(r >= s && r <= e && filter.indexOf(r) === -1){
                if(flag === true)   (f2.indexOf(r) === -1) ? rs += String.fromCharCode(10, r) : l++;
                else                rs += String.fromCharCode(10, r);
            }else{
                l++;
            }
        }
        return rs.replace(/[\n\t\r]*/mgi, '');
    }

    var tools = {
        randomString: randomString,
        randomNumber: randomNumber,
        randomChar: randomChar
    };

    //将方法注入SYST.Tools中，直接返回对象
    if(SYST && SYST.T){
        SYST.T = SYST.extend(SYST.T, tools);
    }

})();