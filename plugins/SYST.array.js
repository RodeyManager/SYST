/**
 * Created by Rodey on 2015/10/9.
 * Array Functions
 */

;(function(SYST){

    //数组去重
    function unique (arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++)
            if (result.indexOf(arr[i]) == -1)
                result.push(arr[i]);
        return result;
    }

    //数组随机打乱
    function shuffle(array) {
        var copy = [], n = array.length, i;
        // 如果还剩有元素。。
        while (n) {
            // 随机选取一个元素
            i = Math.floor(Math.random() * n--);
            // 移动到新数组中
            copy.push(array.splice(i, 1)[0]);
        }
        return copy;
    }

    //数组求并集
    function mixed(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i)
            for(var j=i+1; j<a.length; ++j)
                if(a[i] === a[j])
                    a.splice(j--, 1);
        return a;
    }

    function rang(s, e){
        var s = s, e = e, rs = [];
        while(s <= e){
            rs.push(s);
            s++;
        }
        return rs;
    }

    var tools = {
        unique: unique,
        shuffle: shuffle,
        mixed: mixed,
        rang: rang
    };

    //将方法注入SYST.Tools中，直接返回对象
    if(SYST && SYST.T){
        //SYST.T = SYST.extend(SYST.T, tools);
        SYST.T = SYST.extend(tools, SYST.Tools.prototype);
    }

})(SYST);