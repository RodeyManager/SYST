/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-17
 * Time: 上午11:07
 * To change this template use File | Settings | File Templates.
 */


;(function(){
    'usr strict';

    var shareDialog = function(options){
        var masker          = ($('#share-con'))[0] ? $('#share-con'): $('<div  class="bg_model" id="share-con" />');
        var isloaded        = false;

        var conn            = masker.find('#share-con');
        var html            = masker.html();
        var shareItemCon    = masker.find('.section_nav');
        var shareCancelBtn  = masker.find('#share-btn-cancel');
        var shareBtn        = masker.find('.share-btns');
        var width = shareItemCon.width();
        var height = shareItemCon.height();


        masker.load('tpl/public/shareDialog.html', function(shareDialogHTML){
            isloaded = true;
            masker = $(shareDialogHTML);
            $('#share-con').remove();
            $('body').append(masker);

            conn            = masker.find('#share-con');
            html            = masker.html();
            shareItemCon    = masker.find('.section_nav');
            shareCancelBtn  = masker.find('#share-btn-cancel');
            shareBtn        = masker.find('.share-btns');

            width = shareItemCon.width();
            height = shareItemCon.height();
            shareItemCon.css('bottom', -height);

            _show();

            shareCancelBtn.on('tap', function(evt){
                _hide();
            });

            shareBtn.on('tap', function(evt){
                var self = this, target = $(evt.currentTarget);
                var typeStr = SYST.T.trim(target[0].getAttribute('data-share'));
                _hide();
                console.log(typeStr)
                var opts = {
                    heading: options.heading,
                    summary: options.summary, //"您眼中的运营督导钻石表彰会是什么呀的？先让我们通过一个趣味问答游戏来了解一下她的真面目吧~，能够“一战到底”的伙伴可在钻石晚宴上参加现场抽奖哦~",//必须
                    //定义分享出去后的信息页面连接
                    url: options.url, //"https://ibank.pingan.com.cn/ibank/smartphone/Tianxiatong/index.html?WT.mc_id=zhaozhaocha",    //分享的URL
                    to: typeStr //必须 such as WeChat（微信） or WeChatMoments（微信朋友圈） or SinaWeibo（新浪微博） or TXTtMoments(天下通朋友圈)
                };
                var sopts = (typeof opts === 'object') ? JSON.stringify(opts) : opts;
                console.log(opts);
                //alert(typeof window.android)    ;
                //alert(typeof window.android.shareTo)   ;
                if(typeStr == 'TXTtMoments' && SYST.N.isAndroid){
                    App.toZone(opts.heading, opts.summary, opts.url);
                }else{
                    App.shareTo(sopts);
                }


            });

            function _hide(){
                shareItemCon.stop().animate({
                    bottom: -height
                }, function(){
                    masker.hide();
                });
            }

            function _show(){
                masker.show();
                shareItemCon.stop().animate({
                    bottom: 0
                }, 'fast');
            }


        });



    };

    window.shareDialog = shareDialog;
    return shareDialog;

}).call(this);


