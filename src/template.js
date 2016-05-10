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
    var lineFeedRegx = /\\|\'|\r|\n|\u2028|\u2029/g,
        body = '([\\s\\S]+?)',
        empty = /^=+\s*|\s*$/gi,
        lg = SYST.tplConfig.open,
        rg = SYST.tplConfig.close,
        regxs,
        macs;

    var _content,
        _tplCache = {};

    //模板字符串中需要替换的特殊字符
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    //替换特殊字符
    var escapeSpecial = function(match) {
        return '\\' + escapes[match];
    };

    //将匹配正则对象转换为数据正则字符串
    var fromatRegx = function (rgs){
        var rs = [];
        for(var k in rgs){
            rs.push(rgs[k].source);
        }
        return rs.join('|').replace(/|$/i, '');
    };

    var _reset = function(options){
        options = options || SYST.tplConfig;
        lg = options['open'] || SYST.tplConfig.open;
        rg = options['close'] || SYST.tplConfig.close;
        //匹配正则
        regxs = {
            execter:  new RegExp(lg + body + rg, 'g'),
            exporter: new RegExp(lg + '\\s*=' + body + rg, 'g'),
            escaper: new RegExp(lg + '\\s*==' + body + rg, 'g')
        };
        //定义模板全局匹配正则对象
        macs = new RegExp(fromatRegx(regxs), 'g');
    };

    var _includeReg = /^include\(\s*([^,]+?)\s*,\s*([^,]+?)\s*\)/i;

    /**
     * 渲染模板并输出结果
     * @param tplContent    模板字符串
     * @param data          模板数据变量
     * @param data          自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
     * @returns {string}    渲染后的字符串
     * @private
     */
    var _template = function(tplContent, data, helper, target){

        var Render,
            $source = [],
            $text = [],
            $tplString = 'var _s=""; with($d || {}){ ',
            helperStr = '',
            index = 0,
            data = data;

        if(_tplCache[_content]){
            Render =  _tplCache[_content];
            //执行渲染方法
            return Render.call(target || this, data);
        }

        //判断helper是否存在
        if(helper){
            if(SYST.V.isObject(helper)){
                for(var k in helper){
                    helperStr += helper[k].toString() + ';';
                }
            }
            else if(SYST.V.isFunction(helper)){
                helperStr += helper.toString() + ';';
            }
            else if(SYST.V.isString(helper) && /function\(\)/gi.test(helper)){
                helperStr += helper.replace(/;$/i, '') + ';';
            }else{
                throw new EvalError('helper can be function');
            }

            $tplString = helperStr + $tplString;
        }

        /**
         * 将SYST.T.each方法置入Function字符串中
         * use:
         *  <% each(object|array, function(item, index, [key: options]) %>
         *      <%= item %>
         *  <% }); %>
         */
        $tplString = 'var each = SYST.T.each;' + $tplString;

        /**
         * 采用替换查找方式
         * @params $1: match
         * @params $2: escape
         * @params $5: offset
         */
        tplContent = [lg, 'if(true){', rg, tplContent, lg, '}', rg].join('');
        tplContent.replace(macs, function($1, $2, $3, $4, $5){

            var text = tplContent.slice(index, $5).replace(lineFeedRegx, escapeSpecial);
            if(text && '' != text){
                text = "_s+='" + (text) + "';";
            }else{
                text = '';
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

        //console.log($source, $text);
        //生成 Function 主体字符串
        var source, text;
        for(var i = 0, len = $source.length; i < len; ++i){
            source = $source[i];
            text = $text[i + 1];
            //转移处理
            if(source.search(/^\s*={2}/) !== -1){
                source = source.replace(empty, "");
                source = 'if('+ source +'){ _s+=(SYST.T.escapeHtml('+ source +')); }else{ _s+=""; }';
            }
            else if(/^=[^=]+?/i.test(source)){
                source = source.replace(empty, "");
                source = 'if('+ source +'){ _s+=('+ source +');}else{_s+="";}';
            }
            //include file
            else if(_includeReg.test(source)){
                var stiv;
                source.replace(_includeReg, function(match, src, selector){
                    //console.log(match, src, dom, time);
                    if(src && '' !== src){
                        stiv = setInterval(function(){
                            if(SYST.$(selector)[0]){
                                clearInterval(stiv);
                                SYST.$(selector).load(src);
                            }
                        }, 1000 / 60);
                    }
                });
                source = '';
            }
            $tplString += (source || '') + (text || '');
        }

        //遍历数据
        $tplString = ''+ $tplString +' }; return _s;';
        //console.log($tplString);
        //创建function对象
        Render = new Function('$d', $tplString);
        _tplCache[_content] = Render;
        //执行渲染方法
        $tplString = Render.call(target || this, data);
        return $tplString;
    };

    /**
     * 提供外部接口
     * @param content   元素id或者是模板字符串
     * @param data      渲染需要的数据
     * @param helper    自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
     * @param options   可选项，如设置 模板开关标签样式
     * @param target    作用于模板对象
     * @returns {*}
     * @constructor
     */
    var Render = function(content, data, helper, options, target){

        if(!content){
            console.warn('\u6ca1\u6709\u627e\u5230\u5bf9\u5e94\u7684\u6a21\u677f\u6587\u4ef6\u6216\u8005\u6a21\u677f\u5b57\u7b26\u4e32');
            return '';
        }

        var element, tplContent = '', id;
        _content = content;
        //重置配置
        _reset(options);

        //如果直接是模板字符串
        if(content.search(/[<|>|\/]/i) !== -1){
            tplContent = SYST.T.trim(content);
        }
        //content为element id
        else{

            if(SYST.V.isString(content)){
                id = content.replace(/^#/i, '');
                element = document.getElementById(id);
            }
            else if(SYST.V.isElement(content)){
                element = content;
            }
            //element = document.getElementById('#' + content.replace(/^#/i, ''));
            if(element){
                var tplStr = /^(TEXTEREA|INPUT)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                tplContent = SYST.T.trim(tplStr);
            }else{
                console.warn('\u5143\u7d20\u4e0d\u5b58\u5728');
                return '';
            }
        }

        return _template(tplContent, data, helper, target);

    };

    SYST.Render = Render;
    SYST.T.render = Render;

})(SYST);