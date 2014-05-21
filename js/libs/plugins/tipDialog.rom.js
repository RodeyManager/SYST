/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-3-6
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */

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
                title: '推送',
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

//define(['jQuery', 'text!tpl/public/tipDialog.html'], function($, tipDialogHTML){
;(function(){

    'use strict';

     //模板
     var tipDialogHTML = '<div id="tipDialog" class="tipDialog-00">'+
     '<button type="button" class="close">×</button>'+
     '<i class="tipType"></i>'+
     '<span class="tipTitle">推送</span>'+
     '<p class="tipContent">已通过，更新状态成功！</p>'+
     '<div class="tipBtns">'+
     '<span class="btnCancel">关闭</span>'+
     '<span class="btnOk">确认</span>'+
     '</div>'+
     '</div>';


    var tipDialog = function(options){

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
            time: opts.time || 'fast'
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
                //console.log(obj)
                btnFunction(obj.close);
                if(typeof callback === 'function'){
                    callback.apply(tipDialog, args);
                }
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
        $(masker).stop().fadeIn(defaults.time);


        //获取页面窗口大小
        var ww = $('body').width();//document.documentElement.clientWidth;
        var wh = document.documentElement.clientHeight;
        tipContent.html(opts.msg || '');
        masker.appendChild(tipDialog[0]);
        tipDialog.css({ left: (ww - tipDialog.outerWidth()) / 2, top: (wh - tipDialog.outerHeight()) / 2 - 50 });
        tipDialog.stop().fadeIn(defaults.time);

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

        //按钮存在
        var isOk        = opts.btnOk && opts.btnOk != {};
        var isCancel    = opts.btnCancel && opts.btnCancel != {};
        if(isOk && isCancel){
            btnOk.removeClass('btmRadius').addClass('btmRRadius').css({
                'borderRight': 'solid 1px #CCC',
                'width': 230
            }).text(defaults.btnOk.val);
            btnOk.bind('tap', handEvent(tipDialog, defaults.btnOk.call));

            btnCancel.removeClass('btmRadius').addClass('btmLRadius').css({
                'width': 230
            }).text(defaults.btnCancel.val);
            btnCancel.bind('tap', handEvent(tipDialog, defaults.btnCancel.call));
        }else if(isOk && !isCancel){
            btnOk.removeClass('btmLRadius').addClass('btmRadius').css({
                'borderRight': 'none',
                'width': '100%'
            }).text(defaults.btnOk.val);
            btnOk.bind('tap', handEvent(tipDialog, defaults.btnOk.call));
            btnCancel.css({ 'display': 'none' });
        }else if(!isOk && isCancel){
            btnCancel.removeClass('btmLRadius').addClass('btmRadius').css({
                'borderLeft': 'none',
                'width': '100%'
            }).text(defaults.btnCancel.val);
            btnCancel.bind('tap', handEvent(tipDialog, defaults.btnCancel.call));
            btnOk.css({ 'display': 'none' });
        }else if(!isOk && !isCancel){
            tipBtns.hide();
        }

        btnOk.bind('touchstart',endEvent);

        //关闭
        tipCloseBtn.bind('click', function(){
            tipDialog.hide();
        });

        var show = _show;
        var hide = _hide;

        function _show(time, callback){
            tipDialog.stop().fadeIn(defaults.time, callback);
        };
        function _hide(time, callback){
            tipDialog.stop().fadeOut(defaults.time, callback);
        };

        //按钮默认事件
        function btnFunction(flag, callback){
            if(flag){
                $(masker).stop().fadeOut(defaults.time);
                return false;
            }
            //callback.call(this);
        }

        function endEvent(evt){
            evt.preventDefault();
            evt.stopPropagation();
        }

        return this;
    };
    window.tipDialog = tipDialog;
    //作为SYST框架的模块
    if(window.SYST){
        SYST.tipDialog = tipDialog;
    }
    return tipDialog;
}).call(this);
