/**
 * Created by Rodey on 2015/10/23.
 */
var YT;
(function (YT) {
    var Template = (function () {
        function Template() {
            this.tplConfig = { open: '<%', close: '%>' };
            this.trimSpaceRegx = /^\s*|\s*$/i;
            this.regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
        }
        Template.getInstance = function () {
            if (!this._self)
                return new YT.Template();
            else
                return this._self;
        };
        Template.prototype._render = function (tpl, data) {
            var self = this;
            var outIndex = 0, ms, conf = this.tplConfig, reg = new RegExp(conf.open + '([^' + conf.close + ']+)?' + conf.close, 'g'), code = 'var r = [];\n';
            //添加字符串
            var make = function (line, js) {
                js ? (code += line.match(self.regOut) ? line + '\n' : 'r.push(' + line + ');\n') : (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return make;
            };
            while (ms = reg.exec(tpl)) {
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
        Template.prototype.Render = function (content, data) {
            var elm = document.querySelector('#' + content.replace('#', '')), tpl = '';
            if (elm) {
                var tplStr = /^(TEXTEREA|INPUT)$/i.test(elm.nodeName) ? elm.value : elm.innerHTML;
                tpl = tplStr.replace(this.trimSpaceRegx, '');
            }
            else {
                tpl = content.replace(this.trimSpaceRegx, '');
            }
            try {
                this.cache = this._render(tpl, data);
            }
            catch (e) {
                delete this.cache;
            }
            return this.cache ? this.cache : this._render(tpl, data);
        };
        return Template;
    })();
    YT.Template = Template;
})(YT || (YT = {}));
//# sourceMappingURL=Template.js.map