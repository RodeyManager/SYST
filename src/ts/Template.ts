/**
 * Created by Rodey on 2015/10/23.
 */

module YT{

    export class Template{

        private static _instance: YT.Template;
        public static getInstance(content: string, data?: any, helper?: any, target?: any): YT.Template{
            if(!this._instance) return new YT.Template(content, data, helper, target);
            else            return this._instance;
        }

        private _lineFeedRegx: RegExp = /\\|'|\r|\n|\u2028|\u2029/g;
        private _body: string = '([\\s\\S]+?)';
        private _empty: RegExp = /^=+\s*|\s*$/gi;
        private _tplCache: any = {};
        public lg: string = ST.tplConfig['open'];
        public rg: string = ST.tplConfig['close'];
        public regxs: any;
        public macs: any;
        public content: any;
        public data: any;
        public helper: any;
        public target: any;
        public V: YT.Validate;
        public T: YT.Tools;
        //模板字符串中需要替换的特殊字符
        private _escapes: Object = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        public constructor(content?: string, data?: any, helper?: any, target?: any){
            this.V = new YT.Validate();
            this.T = new YT.Tools();
            this.content = content;
            this.data = data;
            this.helper = helper;
            this.target = target;
        }

        /**
         * 渲染模板并输出结果
         * @param tplContent    模板字符串
         * @param data          模板数据变量
         * @param data          自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
         * @returns {string}    渲染后的字符串
         * @private
         */
        private _template (tplContent, data, helper, target){

            var $source: any[] = [],
                $text: any[] = [],
                $tplString: string = 'var _s=""; with($d || {}){ ',
                helperStr: string = '',
                index: number = 0,
                data: any = data;

            //判断helper是否存在
            if(helper){
                if(this.V.isObject(helper)){
                    for(var k in helper){
                        helperStr += helper[k].toString() + ';';
                    }
                }
                else if(this.V.isFunction(helper)){
                    helperStr += helper.toString() + ';';
                }
                else if(this.V.isString(helper) && /function\(\)/gi.test(helper)){
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
            tplContent.replace(this.macs, function($1, $2, $3, $4, $5){

                var text: string = tplContent.slice(index, $5).replace(this._lineFeedRegx, this._escapeSpecial);
                if(text && '' != text){
                    text = "_s+='" + (text) + "';";
                }else{
                    text = null;
                }
                index = $5 + $1.length;
                $text.push(text);
                $source.push(this.T.trim($2));

                return $1;
            });

            //如果没有匹配到任何模板语句的话直接返回
            if($source.length === 0){
                return tplContent;
            }

            //生成 Function 主体字符串
            var source: string, text: string;
            for(var i = 0, len = $source.length; i < len; ++i){
                source = $source[i];
                text = $text[i + 1];
                if(source.search(/^\s*={2}/) !== -1){
                    source = '_s+=(SYST.T.escapeHtml(' + source.replace(this._empty, "") + '));';
                }
                //转移处理
                else if(/^=[^=]+?/i.test(source)){
                    source = '_s+=(' + (source.replace(this._empty, '')) + ');';
                }
                $tplString += (source || '') + (text || '');
            }

            //遍历数据
            $tplString = ''+ $tplString +' }; return _s;';
            //创建function对象
            var Render: Function = new Function('$d', $tplString);
            //执行渲染方法
            $tplString = Render.call(target || this, data);
            return $tplString;
        }

        /**
         * 提供外部接口
         * @param content   元素id或者是模板字符串
         * @param data      渲染需要的数据
         * @param helper    自定义方法，可选类型为：Object中带有多个方法； function；function的toString后结果
         * @returns {*}
         * @constructor
         */
        public Render (content: string, data: any, helper?: any, target?: any){

            var element: HTMLElement,
                tplContent: string = '',
                content: string = content || this.content,
                data: any = data || this.data;
                helper = helper || this.helper,
                target = target || this.target;

            //重置配置
            this._reset();

            //如果直接是模板字符串
            if(content.search(/[<|>|\/]/i) !== -1){
                tplContent = this.T.trim(content);
            }
            //content为element id
            else{

                if(this._tplCache[content]){
                    return this._tplCache[content];
                }
                element = <HTMLElement>document.querySelector('#' + content.replace('#', ''));
                if(element){
                    var tplStr = /^(TEXTEREA|INPUT)$/i.test(element.nodeName) ? element['value'] : element.innerHTML;
                    tplContent = this.T.trim(tplStr);
                }
                this._tplCache[content] = tplContent;
            }

            return this._template(tplContent, data, helper, target);

        }

        //替换特殊字符
        private _escapeSpecial(match: any) {
            return '\\' + this._escapes[match];
        }

        //将匹配正则对象转换为数据正则字符串
        private _fromatRegx(rgs: any){
            var rs: any[] = [];
            for(var k in rgs){
                rs.push(rgs[k].source);
            }
            return rs.join('|').replace(/|$/i, '');
        }

        private _reset(){
            this.lg = ST.tplConfig['open'];
            this.rg = ST.tplConfig['close'];
            var lg: string = this.lg,
                rg: string = this.rg,
                body: string = this._body;
            //匹配正则
            this.regxs = {
                execter:  new RegExp(lg + body + rg, 'g'),
                exporter: new RegExp(lg + '\\s*=' + body + rg, 'g'),
                escaper: new RegExp(lg + '\\s*==' + body + rg, 'g')
            };
            //定义模板全局匹配正则对象
            this.macs = new RegExp(this._fromatRegx(this.regxs), 'g');
        }

    }



}
