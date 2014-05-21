/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-29
 * Time: 上午10:57
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define([], function(){

    var searchView = SYST.View({
        model :'',
        events:{
            // TOTO
        },
        init  :function(){
            var search = new APPSearch();
        }
    });
    return searchView;
});