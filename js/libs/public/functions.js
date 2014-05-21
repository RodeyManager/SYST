/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-3-8
 * Time: 下午12:15
 * To change this template use File | Settings | File Templates.
 */

;(function(window){

    this.selectColum = function(obj, flag, cls){
        obj = (typeof obj === 'string') ? $(obj): obj;
        if(!flag){
            obj.html('&#10008;').removeClass(cls || 'isReadFeed').css('color', '#FFF').parent('td').parent('tr').css('background', 'none');
        }else{
            obj.html('&#10004;').addClass(cls || 'isReadFeed').css('color', '#02A0AD').parent('td').parent('tr').css('background', '#F0F0F0');
        }
    }
}).call(window);

