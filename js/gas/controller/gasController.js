/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-16
 * Time: 下午12:29
 * To change this template use File | Settings | File Templates.
 * To SYST Controller template, see SYST JS FrameWork
 */

define(['cuModel/gasModel'], function(gasModel){

    var gasCtroller = SYST.Controller({
        name: 'gasCtroller',
        model: gasModel,
        init :function(){
            // TODO
        },

        parseRES: function(res){
            var data = [];
            for(var i = 0; i < res.length; i++){
                if(!res[i].rank || res[i].rank == 0){
                    res[i].rank = i + 1;
                }
                res[i].url = res[i].url.replace(/^<*|>*$/gi, '');
            }
            if(SYST.V.isArray(res)){
                data = res.sort(function(a, b){ return a - b; });
                return data;
            }
            return res;
        },

        /**
         * 身份升级判断显示
         * @param obj
         * @param cls
         * @param msr
         */
        gradeCost: function(obj, cls, msr){
            if(msr == 5){
                obj.addClass(cls);
            }else if(msr > 4 && msr < 5){
                obj.eq(0).removeClass(cls);
            }else if(msr > 3 && msr <= 4){
                obj.eq(0).removeClass(cls);
                obj.eq(1).removeClass(cls);
            }else if(msr > 2 && msr <= 3){
                obj.eq(0).removeClass(cls);
                obj.eq(1).removeClass(cls);
                obj.eq(2).removeClass(cls);
            }else if(msr > 1 && msr <= 2){
                obj.eq(0).removeClass(cls);
                obj.eq(1).removeClass(cls);
                obj.eq(2).removeClass(cls);
                obj.eq(3).removeClass(cls);
            }else if(msr > 0.5 && msr <= 1){
                obj.eq(0).removeClass(cls);
                obj.eq(1).removeClass(cls);
                obj.eq(2).removeClass(cls);
                obj.eq(3).removeClass(cls);
            }else if(msr > 0 && msr <= 0.5){
                obj.removeClass(cls);
            }
        },

        /**
         * 格式化金额
         * @param s
         * @param n
         * @return {String}
         */
        fmoney: function(s, n)
        {
            if(Number(s) == 0){
                return 0;
            }
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            t = "";
            for(i = 0; i < l.length; i ++ )
            {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            //return t.split("").reverse().join("") + "." + r;
            //去除后面的小数位
            var st = t.split("").reverse().join("");
            return st;
        },

        tipDialog: function(msg){
            //chartsIscroll_other.addClass('charts-loading');
            //chartsIscroll_me.addClass('charts-loading');
            tipDialog({msg: msg, autoClose: true, closeTime: 3000});
        }
    });
    return gasCtroller;
});