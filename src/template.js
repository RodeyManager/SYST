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
        lineFeedRegx = /\\|'|\r|\n|\u2028|\u2029/g,
        body = '([\\s\\S]+?)',
        empty = /^=+\s*|\s*$/gi,
        lg = SYST.tplConfig.open,
        rg = SYST.tplConfig.close,
        macs;

    var _tplCache = {};

    //需要转移的字符
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    //模板字符串中需要替换的特殊字符
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    //转移字符
    var escapeHtml = function(html){
        return html.replace(/&(?![\w#]+;)|[<>"']/g, function($1){
            return escapeMap[$1];
        });
    };
    //替换特殊字符
    var escapeSpecial = function(match) {
        return '\\' + escapes[match];
    };

    //匹配正则
    var regxs = {
        execter:  new RegExp(lg + body + rg, 'g'),
        exporter: new RegExp(lg + '\\s*=' + body + rg, 'g'),
        escaper: new RegExp(lg + '\\s*==' + body + rg, 'g')
    };

    //将匹配正则对象转换为数据正则字符串
    var fromatRegx = function (rgs){
        var rs = [];
        for(var k in rgs){
            rs.push(rgs[k].source);
        }
        return rs.join('|').replace(/|$/i, '');
    };
    //定义模板全局匹配正则对象
    macs = new RegExp(fromatRegx(regxs), 'g');

    /**
     * 渲染模板并输出结果
     * @param tplContent    模板字符串
     * @param data          模板数据变量
     * @returns {string}    渲染后的字符串
     * @private
     */
    var _template = function(tplContent, data){

        var $source = [],
            $text = [],
            $tplString = "",
            index = 0,
            data = data;

        /**
         * 采用替换查找方式
         * @params $1: match
         * @params $2: escape
         * @params $5: offset
         */
        tplContent.replace(macs, function($1, $2, $3, $4, $5){

            var text = tplContent.slice(index, $5).replace(lineFeedRegx, escapeSpecial);
            if(text && '' != text){
                text = "_s+='" + (text) + "';";
            }else{
                text = null;
            }
            index = $5 + $1.length;
            $text.push(text);
            $source.push(SYST.T.trim($2));

            return $1;
        });

        //如果没有匹配到任何模板语句的话直接返回
        if($source.length === 0){
            return tplContent;
        }

        //生成 Function 主体字符串
        var source, text;
        for(var i = 0, len = $source.length; i < len; ++i){
            source = $source[i];
            text = $text[i + 1];
            if(source.indexOf('==') !== -1){
                source = '_s+=(' + escapeHtml(source.replace(empty, '')) + ');';
            }
            //转移处理
            else if(/^=[^=]+?/i.test(source)){
                source = '_s+=(' + (source.replace(empty, '')) + ');';
            }
            $tplString += (source || '') + (text || '');
        }

        //遍历数据
        $tplString = 'var _s=""; with($d || {}){ '+ $tplString +' }; return _s;';
        //创建function对象
        var Render = new Function('$d', $tplString);
        //执行渲染方法
        $tplString = Render(data);
        return $tplString;
    };

    /**
     * 提供外部接口
     * @param content   元素id或者是模板字符串
     * @param data      渲染需要的数据
     * @param flag      content是否为模板字符串, 如果是模板id值，则可以忽略；
     *                  如果传递的是模板字符串，则为true
     * @returns {*}
     * @constructor
     */
    var Render = function(content, data, flag){

        var element, tplContent = '';

        //如果直接是模板字符串
        if(flag === true || content.search(/[<|>|\/]/i) !== -1){
            tplContent = SYST.T.trim(content);
        }
        //content为element id
        else{

            if(_tplCache[content]){
                return _tplCache[content];
            }
            element = document.querySelector('#' + content.replace('#'));
            if(element){
                var tplStr = /^(TEXTEREA|INPUT)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                tplContent = SYST.T.trim(tplStr);
            }
            _tplCache[content] = tplContent;
        }

        return _template(tplContent, data);

    };

    SYST.Render = Render;

})(SYST);