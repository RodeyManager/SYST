/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-9
 * Time: 下午2:12
 * To change this template use File | Settings | File Templates.
 * To SYST Controller template, see SYST JS FrameWork
 */

define(['currentModel'], function(T2048Model){

    var T2048Ctroller = SYST.Controller({
        model: T2048Model,
        init :function(){
            // TODO



        },
        //jQuery 实现
        JQuery: function(){
            //固定高度边栏固定
            var jWindow = $(window);
            var jbSide = $('#J_BdSide');
            jWindow.scroll(function(evt){
                var scrollHeight = jWindow.scrollTop();
                var screenHeight = jWindow.height();
                var sideHeight = jbSide.height();
                if(scrollHeight + screenHeight > sideHeight){
                    jbSide.css({
                        'position': 'fixed',
                        'top': -(sideHeight - screenHeight),
                        'right': '0'
                    });
                }else{
                    jbSide.css({
                        'position': 'static'
                    });
                }
            });
            jWindow.resize(function(){
                jWindow.trigger('scroll');
            });
            window.onload = function(){
                jWindow.trigger('scroll');
            } ;
        } ,
        //JS 原生实现
        JScore: function(){
            var $$ = function(id){ return document.getElementById(id); };
            var addEvent = function(obj, event, fn){
                if(obj.addEventListener){
                    obj.addEventListener(event, fn, false);
                }else if(obj.attachEvent){
                    obj.attachEvent('on'+event, fn);
                }
            };

            var jbSide = $$('J_BdSide');
            addEvent(window, 'scroll', function(){
                scrollEvent();
            });

            addEvent(window, 'resize', function(){
                scrollEvent();
            });
            addEvent(window, 'load', function(){
                scrollEvent();
            });

            var scrollEvent = function(){
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
                var screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var sideHeight = jbSide.offsetHeight;
                if(scrollHeight + screenHeight > sideHeight){
                    jbSide.style.cssText('position:fixed;right:0px;top:-'+ (sideHeight - screenHeight));
                }else{
                    jbSide.style.position = 'static';
                }
            }

        }
    });
    return T2048Ctroller;
});