/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-25
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */


define([], function(){

    var silderView = SYST.View({
        events:{
            // TOTO
        },
        init: function(){

            var data = [
                { src: 'images/1.jpg', link: 'baidu.com' },
                { src: 'images/1.jpg', link: 'baidu.com' },
                { src: 'images/1.jpg', link: 'baidu.com' },
                { src: 'images/1.jpg', link: 'baidu.com' },
                { src: 'images/1.jpg', link: 'baidu.com' }
            ];

            var slider = new APPSlider(null, data, {showBtnNums: false, completeCallBack: function(){
                //console.log(this.getCurrent());
            }});
        }
    });

});
