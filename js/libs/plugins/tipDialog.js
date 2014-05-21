/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-3-6
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */

/**
 * 弹窗提示插件
 */

define(['jQuery', 'text!tpl/public/tipDialog.html'], function($, tipDialogHTML){
    /**
     * 提示弹窗
     * @param type      类型:  success (成功) || warning (警告) || info (消息) || danger (异常错误)
     * @param options   可选:  预留选项
     * @return { Object }
     *
     * Use:
     *
     * tipDialog({
                msg:'【公众号推荐】"理财宝宝大比拼"，新理财资讯一网打尽',  //内容
                type: 'success',                                     //状态
                btnOk: {                                             //确认按钮
                    val: '确认',                                     // 按钮文字
                    call: function(evt){                             // 确认按钮回调函数
                        console.log(evt)
                    },
                    close: false                                     // 触发后是否关闭弹窗（ true: 关闭， false: 保留）
                },
                btnCancel:{
                    val: '关闭',
                    call: function(evt){
                        console.log(evt)
                    },
                    close: true
                }
            });
     *
     *
     */
    var tipDialog = function(options){
        var self = this;
        //创建选项
        var opts = options || {};
        var defaults = {
            type: opts.type || '',
            title: opts.title || '',
            msg: opts.msg || '',
            btnOk: {
                val: opts.btnOk && opts.btnOk.val || '\u786e\u8ba4', //确认
                call: opts.btnOk && opts.btnOk.call || btnFunction,
                close: (opts.btnOk && opts.btnOk.close != undefined) ? opts.btnOk.close : true
            },
            btnCancel: {
                val: opts.btnCancel && opts.btnCancel.val || '\u5173\u95ed', //关闭
                call: opts.btnCancel && opts.btnCancel.call || btnFunction,
                close: (opts.btnCancel && opts.btnCancel.close != undefined) ? opts.btnCancel.close : true
            },
            lock: opts.lock || true,
            time: opts.time || 'fast',
            autoClose: opts.autoClose || false,
            closeTime: opts.closeTime || 3000,
            ZorQ: !!window.jQuery
        };

        //回调执行
        var handEvent = function(obj, callback){
            var self = this, args = [];
            for(var i = 2; i < arguments.length; i++)   args.push(arguments[i]);
            return function(e){
                e.preventDefault();
                e.stopPropagation();
                args.push(e);
                //$(masker).stop().fadeOut(defaults.time);
                btnFunction(obj.close);
                callback.apply(tipDialog, args);
            }
        };

        var cache = [];
        var tipDialog    = $('#tipDialog')[0] ? $('#tipDialog') : $(tipDialogHTML);
        var tipCloseBtn  = tipDialog.find('.close');
        var tipType      = tipDialog.find('.tipType');
        var tipTitle     = tipDialog.find('.tipTitle');
        var tipContent   = tipDialog.find('.tipContent');

        //按钮
        var tipBtns      = tipDialog.find('.tipBtns');
        var btnOk        = tipDialog.find('.btnOk');
        var btnCancel    = tipDialog.find('.btnCancel');

        /* 创建背景遮罩层 */
        var masker = document.getElementById('tipDialogMasker00')
                    ? document.getElementById('tipDialogMasker00')
                    : document.createElement('div');
        masker.setAttribute('id', 'tipDialogMasker00');
        masker.setAttribute('class', 'tipDialogMasker');
        document.body.appendChild(masker);
        //jQuery
        $(masker).stop().fadeIn(defaults.time);
        //zepto
        //$(masker).show();


        //获取页面窗口大小
        var ww = $('body').width();//document.documentElement.clientWidth;
        var wh = document.documentElement.clientHeight;
        tipContent.html(opts.msg || '');
        masker.appendChild(tipDialog[0]);
        tipDialog.css({ left: (ww - tipDialog.outerWidth()) / 2, top: (wh - tipDialog.outerHeight()) / 2 - 50 });
        //jQuery
        tipDialog.stop().fadeIn(defaults.time);
        //zepto
        //tipDialog.show();

        //类型定义
        if(defaults.type && defaults.type != ''){
            tipType.css({ 'backgroundImage': 'url("images/icons/'+ defaults.type +'.png")', 'display': 'block' });
        }

        //显示标题
        if(defaults.title && defaults.title != ''){
            tipTitle.text(defaults.title).show();
        }else{
            tipTitle.text('').hide();
        }

        //自动隐藏
        if(defaults.autoClose){
            setTimeout(function(){
                _hide();
            }, defaults.closeTime);
        }

        //按钮存在
        var isOk        = opts.btnOk && opts.btnOk != {};
        var isCancel    = opts.btnCancel && opts.btnCancel != {};
        if(isOk && isCancel){
            btnOk.removeClass('btmRadius').addClass('btmRRadius').css({
                'borderLeft': 'solid 1px #CCC',
                'width': 230
            }).text(defaults.btnOk.val);
            btnOk.bind('touchend', handEvent(defaults.btnOk, defaults.btnOk.call));

            btnCancel.removeClass('btmRadius').addClass('btmLRadius').css({
                'width': 230
            }).text(defaults.btnCancel.val);
            btnCancel.bind('touchend', handEvent(defaults.btnCancel, defaults.btnCancel.call));
        }else if(isOk && !isCancel){
            btnOk.removeClass('btmRRadius').addClass('btmRadius').css({
                'borderLeft': 'none',
                'width': '100%'
            }).text(defaults.btnOk.val);
            btnOk.bind('touchend', handEvent(defaults.btnOk, defaults.btnOk.call));
            btnCancel.css({ 'display': 'none' });
        }else if(!isOk && isCancel){
            btnCancel.removeClass('btmLRadius').addClass('btmRadius').css({
                'borderLeft': 'none',
                'width': '100%'
            }).text(defaults.btnCancel.val);
            btnCancel.bind('touchend', handEvent(defaults.btnCancel, defaults.btnCancel.call));
            btnOk.css({ 'display': 'none' });
        }else if(!isOk && !isCancel){
                tipBtns.hide();
        }

        btnOk.bind('touchstart', this.endEvent);

        //关闭
        tipCloseBtn.bind('click', function(){
            tipDialog.hide();
        });

        var show = _show;
        var hide = _hide;

        function _show(time, callback){
            //jQuery
            $(masker).stop().fadeIn(defaults.time, callback);
            //zepto
            //$(masker).show();
        };
        function _hide(time, callback){
            //jQuery
            $(masker).stop().fadeOut(defaults.time, callback);
            //zepto
            //$(masker).hide();
        };

        //按钮默认事件
        var btnFunction = function(flag, callback){
            if(flag){
                //jQuery
                $(masker).stop().fadeOut(defaults.time);
                //zepto
                //$(masker).hide();
                return false;
            }
            //callback.call(this);
        };

        var endEvent = function(evt){
            evt.preventDefault();
            evt.stopPropagation();
        };

        return this;
    };
    window.tipDialog = tipDialog;
    //作为SYST框架的模块
    if(window.SYST){
        SYST.tipDialog = tipDialog;
    }
    return tipDialog;
});