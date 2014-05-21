/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-9
 * Time: 下午2:12
 * To change this template use File | Settings | File Templates.
 * To SYST Model template, see SYST JS FrameWork
 */

define([], function(){

    var T2048Model = SYST.Model({
        init       :function(){
            // TODO 
        },
        getPage    :function(){
            return this.page || 1;
        },
        getPageSize:function(){
            return this.pageSize || 20;
        },
        setPage    :function(page){
            this.page = page;
        },
        setPageSize:function(size){
            this.pageSize = size;
        }
    });
    return T2048Model;
});