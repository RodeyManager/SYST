/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-29
 * Time: 上午11:39
 * To change this template use File | Settings | File Templates.
 */


;(function(window){
    'usr strict';

    var root = this;
    var APPSearch = function(options){
        var self = this;
        self.wrap;
        self.html;
        self.APPSearchCon;
        self.APPSearchText;
        self.APPSearchBtn;
        self.text = '';

        self.opts = {
            autoComplate: (options && options.autoComplate) ? 'autocomplete' : '',
            autoFocus: (options && options.autoFocus) ? 'autofocus' : '',
            isModel: (options && options.isModel) ? options.isModel : true
        };

        self._init();

    };

    APPSearch.prototype = {
        _init: function(){
            var self = this;
            self.wrap = document.getElementById('APPSearch-con') ? $('#APPSearch-con') : (function(){
                var wrap =  '<section class="APPSearch-con" id="APPSearch-con">'+
                            '<i class="APPSearch-icon" />'+
                            '<input type="text" name="app-searchKey" id="app-searchKey" class="app-searchKey" value="" placeholder="搜索" '+ self.opts.autoComplate + self.opts.autoFocus +' />'+
                            '<input type="button" name="app-csearch-btn" id="app-csearch-btn" class="app-csearch-btn" value="取消" style="display:none;" />'+
                            '</section>';
                $('body').prepend(wrap);
                return $(wrap);
            })();
            self.html = self.wrap.html();
            self.APPSearchCon = $('section').filter('#APPSearch-con');
            self.APPSearchText = self.APPSearchCon.find('#app-searchKey');
            self.APPSearchBtn  = self.APPSearchCon.find('#app-csearch-btn');

            self.conWidth = parseFloat(self.APPSearchCon.width() || document.documentElement.clientWidth);
            self.APPSearchText.css('textIndent', self.conWidth / 2 - 10);

            self._render();
        },
        _render: function(){
            var self = this;
            self.APPSearchText.bind('focus click', holdEvent(self, self._Inevent));
            self.APPSearchText.bind('blur', holdEvent(self, self._Unevent));
            self.APPSearchBtn.bind('click', holdEvent(self, self._Outevent));
        },
        _Inevent: function(evt){
            var self = this;
            var target = $(evt.currentTarget);

            var txtCss = {
                'width': '80%',
                'text-indent': '18px'
            };
            var btnCss= {
                width: '18%',
                display: 'inline-block'
            };

            target.animate(txtCss, function(){
                self.APPSearchBtn.css(btnCss).show();
            });

            self.APPSearchCon.find(':after').animate({
                left: self.conWidth / 2 - 26
            });

        },
        _Outevent: function(evt){
            var self = this;
            var target = $(evt.currentTarget);
            var txtCss = {
                'width': '100%',
                'text-indent': self.conWidth / 2 - 10
            };
            var btnCss= {
                width: '18%',
                display: 'inline-block'
            };
            target.hide();
            self.APPSearchText.animate(txtCss);
        },
        _Unevent: function(evt){
            var self = this;
            var target = $(evt.currentTarget);
            self.text = self.APPSearchText.val() || '';
            var txtCss = {
                'width': '100%',
                'text-indent': self.conWidth / 2 - 10
            };
            var btnCss= {
                width: '18%',
                display: 'inline-block'
            };
            self.APPSearchBtn.hide();
            self.APPSearchText.animate(txtCss);
        },
        getHtml: function(){
            return this.html;
        },
        getText: function(){
            return this.text;
        }
    };

    /**
     * 改变对象作用域
     * @param obj
     * @param func
     * @return {Function}
     */
    var holdEvent = function(obj, func){
        var args = [];
        for(var i=2; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        return function(e){
            args.push(e);
            func.call(obj, e, args);
        }
    };

    root.APPSearch = APPSearch;
    return APPSearch;

}).call(this);

