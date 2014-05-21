/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-25
 * Time: 下午5:59
 * To change this template use File | Settings | File Templates.
 */

/**
 * 图片滚动插件
 *
 */


;(function(){
    'use strict';

    var rAF = window.requestAnimationFrame	||
        window.webkitRequestAnimationFrame	||
        window.mozRequestAnimationFrame		||
        window.oRequestAnimationFrame		||
        window.msRequestAnimationFrame		||
        function (callback) { window.setTimeout(callback, 1000 / 60); };

    var root = this;
    var gVars = {
        step: 50,
        //模板
        mainCon:    '<section class="APPSlider-con" id="APPSlider-00"></section>',
        tpl:        '<ul class="APPSlider-ul-con"></ul>' +
                    '<div class="APPSlider-btns-con"></div>',
        liTpl:      '<li><a href="javascript:void(0);" target="_blank"><img src="" width="640" alt=""/></a></li>',
        //one    '<span class="APPSlider-btns on">1</span>'
        btnTpl:     '<span class="APPSlider-btns">1</span>'
    };



    var APPSlider = function(el, imgs, options){
        var self = this;
        var options = options || {};
        self.htmlDom = null;
        self.appWrap = $ ? $('#APPSlider-00')[0] : document.getElementById('APPSlider-00');

        //初始化定义变量
        self.step = gVars.step;
        self.s = null;
        self.st = null;

        self.APPSliderCon = null;
        self.APPSliderUlCon = null;
        self.APPSliderLi = null;
        self.APPSliderBtnsCon = null;
        self.APPSliderBtns = null;

        self.opts = {
            imgs: (imgs && SYST.V.isArray(imgs) && imgs.length > 0) ? imgs : [],

            width: (options && options.width) ? options.width : document.documentElement.clientWidth,
            height: (options && options.height) ? options.height : document.documentElement.clientHeight,
            showBtnNums: (options && options.showBtnNums) ? options.showBtnNums : false,
            time: (options && options.time) ? options.time : 3000,
            completeCallBack: (options && options.completeCallBack && typeof options.completeCallBack == 'function') ? options.completeCallBack : function(){}
        };

        //对象初始化
        self._init();
    };

    APPSlider.prototype = {
        _init: function(){
            var self = this;
            //加载组件模板
            if(!self.appWrap){
                self.appWrap = document.createElement('div');
                self.appWrap.setAttribute('id', 'APPSlider-00');
                self.appWrap.setAttribute('class', 'APPSlider-con');
                //加入到页面中
                document.body.appendChild(self.appWrap);
            }else{
                $ ? ($(self.appWrap).show()) : (self.appWrap.style.display = 'block');
            }

            self._render();

        },
        _render: function(){
            var self = this;
            var appWrap = $(self.appWrap).html(gVars.tpl);
            self.APPSliderCon = appWrap;
            self.APPSliderUlCon = appWrap.find('.APPSlider-ul-con');
            self.APPSliderLi = appWrap.find('.APPSlider-ul-con li');
            self.APPSliderBtnsCon = appWrap.find('.APPSlider-btns-con');
            self.APPSliderBtns = appWrap.find('.APPSlider-btns-con span');

            appWrap.css({
                width: self.opts.width,
                height: self.opts.height
            });

            self._show();
        },
        _show: function(){
            var self = this;
            var appWrap = $(self.appWrap);
            //console.log(self.APPSliderUlCon)
            var li = '';
            var span = '';
            var a = $(li).find('a');
            var img = '<img src="" alt="" />';
            var i = 0;
            var len = self.opts.imgs.length;
            var imgs = self.opts.imgs;
            var w = 0;
            self.len = len;
            //console.log(imgs)

            if(len > 0){
                for( ;i < len; i++){
                    //li += '<li><a href="'+ imgs[i].link +'"><img src="'+ imgs[i].src +'" width="100%" alt="" /></a></li>';
                    li += '<li><a href="javascript:void(0);"><img src="'+ imgs[i].src +'" width="100%" alt="" /></a></li>';
                    span += '<span data-bid="'+ i +'" class="APPSlider-btns '+ (i==0 ? "on" : "") + '">'+ (self.opts.showBtnNums ? i : "") +'</span>';
                }
                //console.log(li)
                self._appendTo(self.APPSliderUlCon, li);
                self._appendTo(self.APPSliderBtnsCon, span);
            }

            //渲染后重新获取
            self.APPSliderLi = appWrap.find('.APPSlider-ul-con li');
            self.APPSliderBtns = appWrap.find('.APPSlider-btns-con span');

            self.APPSliderLi.css({
                width: self.opts.width,
                height: self.opts.height
            });
            self.APPSliderUlCon.css({
                width: self.opts.width * self.APPSliderLi.length,
                height: self.opts.height,
                marginLeft: 0
            });

            self.conWidth = self.opts.width * self.APPSliderLi.length;

            //自动切换
            self._autoPlay();
            //按钮侦听
            appWrap.delegate('.APPSlider-btns-con span', 'click', holdEvent(self, self._switchTap));
            appWrap.delegate('.APPSlider-btns-con span', 'touchstart', holdEvent(self, self._switchTapStart));

            self.hasTouch = 'ontouchstart' in window || window.TouchEvent;
            /*if(self.hasTouch){
                self.APPSliderUlCon.on('touchstart', holdEvent(self, self._dragStart));
                self.APPSliderUlCon.on('touchmove', holdEvent(self, self._dragMove));
                self.APPSliderUlCon.on('touchend', holdEvent(self, self._dragEnd));
            }else{
                self.APPSliderUlCon.on('mousedown', holdEvent(self, self._dragStart));
                self.APPSliderUlCon.on('mousemove', holdEvent(self, self._dragMove));
                self.APPSliderUlCon.on('mouseup', holdEvent(self, self._dragEnd));
            }*/
        },

        _autoPlay: function(index){
            var self = this;
            index = index || 0;
            self.s = setInterval(function(){
                if(index > self.len - 1){
                    index = 0;
                }
                //按钮样式
                self.APPSliderBtns.removeClass('on');
                self.APPSliderBtns.eq(index).addClass('on');
                //console.log(index)

                self.APPSliderUlCon.animate({
                    'margin-left': -( index * self.opts.width)
                    //'-webkit-transform': 'translateX(' + -( index * self.opts.width) + 'px)'
                }, function(){
                    self.opts.completeCallBack.call(self);
                });

                self.marginLeft = self.APPSliderUlCon.css('marginLeft');

                self.getCurrent();

                index ++;
            }, self.opts.time);
        },

        _appendTo: function(obj, content){
            //console.log(obj)
            //console.log(content)
            obj.append(content);
        },

        _switchTap: function(evt){
            clearInterval(this.s);
            clearTimeout(this.st);
            evt.preventDefault();
            evt.stopPropagation();
            var self = this;
            var target = $(evt.currentTarget);
            var bid = target.attr('data-bid');
            self.APPSliderBtns.removeClass('on');
            target.addClass('on');

            self.APPSliderUlCon.animate({
                'margin-left': -(bid * self.opts.width)
                //'-webkit-transform': 'translateX(' + -(bid * self.opts.width) + 'px)'
            }, function(){
                self.st = setTimeout(function(){
                    self._autoPlay(bid);
                }, self.opts.time);
            });
            //console.log(bid)
        },
        _switchTapStart: function(evt){
            clearInterval(this.s);
            /*evt.preventDefault();
            evt.stopPropagation();*/
        },
        //获取当前对象
        getCurrent: function(){
            var self = this;
            var data = {};
            var index = $(self.appWrap).find('span.on').attr('data-bid');
            data.btn = ($(self.appWrap).find('span.on'))[0];
            data.btnNum = parseInt(index);
            data.slidetion = (self.APPSliderUlCon.eq(index))[0];
            data.src = self.opts.imgs[index].src;
            data.link = self.opts.imgs[index].link;
            //console.log(data)
            return data;
        },

        //拖动事件函数
        _dragStart: function(evt){
            clearInterval(this.s);
            clearTimeout(this.st);
            var self = this;
            var e = evt.originalEvent.changedTouches[0];
            self.isTouchStart = true;

            //初始位置
            self.startX = e.pageX || e.clientX;
            self.marginLeft = parseInt(self.APPSliderUlCon.css('marginLeft'));
            self.startTime = Date.now || +(new Date());
            //console.log(self.startX)
            //console.log(self.marginLeft)

        },
        _dragMove: function(evt){
            clearInterval(this.s);
            clearTimeout(this.st);
            var self = this;
            var target = $(evt.currentTarget);
            var e = evt.originalEvent.changedTouches[0];
            if(this.isTouchStart){
                self.dx = self.marginLeft - (self.startX - (e.pageX || e.clientX));
                console.log(self.dx)
                var marginLeft = this._formateX(self.dx);
                self._scrollX(target, marginLeft);
            }

        },
        _dragEnd: function(evt){
            clearInterval(this.s);
            clearTimeout(this.st);
            var self = this;
            var target = $(evt.currentTarget);
            var e = evt.originalEvent.changedTouches[0];
            self.isTouchStart = false;


            var offset =  (e.pageY || e.clientX) - self.startX;
            var curLeft = self.marginLeft + offset;
            var speed = offset / (+(new Date()) - self.startTime);
            if(Math.abs(speed) > 0.5) {
                curLeft -= speed * 500;
            }

            var marginLeft = self._formateX(curLeft);
            self._scrollX(target, marginLeft);

            /*if(self.hasTouch){
                self.APPSliderUlCon.off('touchmove', holdEvent(self, self._dragMove));
                self.APPSliderUlCon.off('touchend', holdEvent(self, self._dragEnd));
            }else{
                self.APPSliderUlCon.off('mousemove', holdEvent(self, self._dragMove));
                self.APPSliderUlCon.off('mouseup', holdEvent(self, self._dragEnd));
            }*/
        },
        _scrollX: function(target, x){
            console.log(x)
            var self = this;
            target.animate({
                'marginLeft': x
            }, function(){
                var mesc = Math.abs(x) % 320;
                var sx = 0;
                if(merc != 0){
                    var sx = 50 * Math.round(x / 320) - ( Math.abs(mesc) < 320 ? 0 : 320);
                    target.animate({
                        'marginLeft': sx
                    });
                }
                //alert(x)
                //alert(self.APPSliderUlCon.css('marginLeft'))
            });
        },
        _formateX: function(x){
            if(Math.abs(x) > this.conWidth){
                x = -this.conWidth + 320;
            }else if(x > 0){
                x = -x;
            }
            //self.marginLeft = x;

            return x;
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

    root.APPSlider = APPSlider;
    return APPSlider;

}).call(this);
