/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-12
 * Time: 下午5:01
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define(function(){

    var scrollSideView = SYST.View({
        model :'',
        events:{
            /*'mouseover #moocBox': 'stopScroll',
            'mouseout #moocBox': 'startScroll'*/
        },
        /**
         * 无缝滚动
         */
        init  :function(){
            var moocBox = document.getElementById('moocBox');
            var col1 = document.getElementById('col1');
            var col2 = document.getElementById('col2');
            col2.innerHTML = col1.innerHTML;
            var scrollUp = function(){
                if(moocBox.scrollTop >= col1.offsetHeight){
                    moocBox.scrollTop = 0;
                }else{
                    moocBox.scrollTop++;
                }
            };
            moocBox.scrollTop = 0;
            var time = 50;
            var stv = setInterval('scrollUp()', time);

            //鼠标滑过
            moocBox.onmousemove = function(){
                clearInterval(stv);
            };
            moocBox.mouseout = function(){
                stv = setInterval('scrollUp()', time);
            };

        },
        /**
         * 间隔滚动
         */
        init2: function(){
            var moocBox = document.getElementById('moocBox');
            moocBox.innerHTML += moocBox.innerHTML;
            var liHeight = 24; //滚动高度
            var speed = 50;    //滚动速度
            var time = 2000;   //间隔时间
            var stv;
            var scrollUp = function(){
                //moocBox.scrollTop++;
                if(moocBox.scrollTop % liHeight == 0){
                    clearInterval(stv);
                    setTimeout('startMove()', time);
                }else{
                    moocBox.scrollTop++;
                    if(moocBox.scrollTop >= moocBox.offsetHeight / 2){
                        moocBox.scrollTop = 0;
                    }
                }
            };
            var startMove = function(){
                moocBox.scrollTop++;
                stv = setInterval('scrollUp()', speed);
            };
            moocBox.scrollTop = 0;
            setTimeout('scrollUp()', time);

            //鼠标滑过
            moocBox.onmousemove = function(){
                clearInterval(stv);
            };
            moocBox.mouseout = function(){
                stv = setInterval('startMove()', speed);
            };
        }

    });
    return scrollSideView;
});