/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-9
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */


define([], function(){

    var loadPageView = SYST.View({
         init: function(){

             //隐藏  ( 这个是在main.js里面显示的，在开始加载的时候就show )
             var pl = new PageLoading();
             pl.hide();

         }
    });

    return loadPageView;

});

