/**
 * Created by Rodey on 2015/10/16.
 */

;(function(SYST){

    'use strict';

    /**
     * SYST Template Render mini engine
     * @type {{open: string, close: string}}
     */
    SYST.tplConfig = { open: '<%', close: '%>'};
    var trimSpaceRegx = /^\s*|\s*$/i,
        regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

    var _Render = function(tpl, data){
        var outIndex = 0, ms, conf = SYST.tplConfig,
            reg = new RegExp(conf.open + '([^'+ conf.close +']+)?' + conf.close, 'g'), // /<%([^%>]+)?%>/g,
            code = 'var r = [];\n';
        //添加字符串
        var make = function(line, js){
            js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return make;
        };
        while(ms = reg.exec(tpl)){
            make(tpl.slice(outIndex, ms.index))(ms[1], true);
            outIndex = ms.index + ms[0].length;
        }
        make(tpl.substr(outIndex, tpl.length - outIndex));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
    };
    /**
     * 提供外部接口
     * @param content   元素id或者是模板字符串
     * @param data      渲染需要的数据
     * @returns {*}
     * @constructor
     */
    SYST.Render = function(content, data){
        var elm = document.querySelector('#' + content.replace('#')), tpl = '';
        if(elm){
            var tplStr = /^(TEXTEREA|INPUT)$/i.test(elm.nodeName) ? elm.value : elm.innerHTML;
            tpl = tplStr.replace(trimSpaceRegx, '');
        }else{
            tpl = content.replace(trimSpaceRegx, '');
        }
        try{
            this.cache = _Render(tpl, data);
        }catch(e){
            delete this.cache;
        }
        return this.cache ? this.cache : _Render(tpl, data);
    };

})(SYST);