/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-1
 * Time: 上午11:30
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define([], function(){

    var CANVAS_WIDTH = document.documentElement.clientWidth,
        CANVAS_HEIGHT = 300,
        SPEEDX = 0.3;

    var loadDataView = SYST.View({
        model :'',
        events:{
            // TOTO
            'touchstart body': 'start',
            'touchmove body': 'move',
            'touchend body': 'end'

        },
        init  :function(){
            var self = this;
            self.context = ($('#loadData')[0]).getContext('2d');
            //先绘制一个圆
            self.drawCircles(self.context);
            //self.drawImage(self.context, 'images/5-121204193R5-50.gif');


            //$('body')[0].addEventListener('touchstart', self.down);
            //$('body')[0].addEventListener('touchmove', self.move);
            //$('body')[0].addEventListener('touchend', self.end);

        },
        start: function(evt){
            var self = this;
            var e = evt.originalEvent.changedTouches[0];
            //console.log(evt)
            self.startTime = +new Date();
            self.startX = e.pageX;
            self.startY = e.pageY;
            console.log(self.startY)
            if(self.startY < 50){
                $('body')[0].removeEventListener('touchmove', self.move);
                $('body')[0].addEventListener('touchend', self.end);
                return false;
            }
        },
        move: function(evt){
            var self = this;
            var e = evt.originalEvent.changedTouches[0];
            //var my = (e.pageY) > (CANVAS_HEIGHT / 2) ? (CANVAS_HEIGHT / 2) : (e.pageY);
            if(e.pageY < 50){
                $('body')[0].removeEventListener('touchmove', self.move);
                $('body')[0].addEventListener('touchend', self.end);
                return false;
            }
            var my = (e.pageY - 50);
            var dx = SPEEDX;
            var sx = 80 + dx;
            var ex = 120 - dx;
            var ltx1 = 90 + dx;
            var ltx2 = 110 - dx;

            if(my <= 50){
                my = 50;
            }

            self.drawEllipse(self.context, {
                startX: sx < 80 ? 80 : sx,
                startY: 50,
                ltx1: ltx1 < 90 ? 90 : ltx1,
                lty1: my,
                ltx2: ltx2 > 110 ? 110 : ltx2,
                lty2: my,
                endX: ex > 120 ? 120 : ex,
                endY: 50,
                speed: SPEEDX
            });
            //console.log(evt)
            SPEEDX += 0.1;
        },
        end: function(evt){
            var self = this;
            var e = evt.originalEvent.changedTouches[0];
            if(e.pageY < 50){
                $('body')[0].removeEventListener('touchmove', self.move);
                $('body')[0].removeEventListener('touchend', self.end);
                return false;
            }

            /*还原*/
            self.drawCircles(self.context);

            //执行一个回调
            if(self.loadStart && typeof self.loadStart === 'function'){
                self.loadStart(self.context);
            }
            SPEEDX = 0.3;
            //
            $('body')[0].removeEventListener('touchmove', self.move);
            $('body')[0].removeEventListener('touchend', self.end);
        },

        drawCircle: function(context, options){
            var x = options && options.x || 0,
                y = options && options.y || 50,
                r = options &&  options.r || 10,
                sa = options && options.sa || 0,
                ea = options && options.ea || Math.PI * 2;

            context.save();
            context.beginPath();
            context.fillStyle = 'rgba(100,100,180,1)';
            context.strokeStyle = 'rgba(0,0,0,0)';
            context.arc(x, y, r, sa, ea, false);
            context.fill();
            context.closePath();
            context.restore();
        },
        drawCircles: function(context){
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.drawCircle(context, { x: 100, y: 50, r: 20, sa:0, ea: Math.PI * 2 });
            this.drawCircle(context, { x: 100, y: 50, r: 10, sa:0, ea: Math.PI * 2 });
            //this.drawImage(context, 'images/20111105214801743-24.png');
            this.drawLoadIcon(context);
        },
        drawImage: function(context, src, w, h){
            var self = this;
            self.isLoadImg = false;
            var img = new Image();
            img.onload = function(){
                self.isLoadImg = true;
                context.save();
                //context.drawImage(img, 83, 34, w, h);
                context.drawImage(img, 84, 34, 32, 32);
                context.restore();
            };
            img.src = src;
        },
        drawEllipse: function(context, options){
            var self = this;

            var startX = options && options.startX || 80,
                startY = options && options.startY || 50,
                ltx1 = options && options.ltx1 || 90,
                lty1 = options && options.lty1 || Math.random() * 130 + startY,
                ltx2 = options && options.ltx2 || 110,
                lty2 = options && options.lty2 || Math.random() * 130 + startY,
                endX = options && options.endX || 120,
                endY = options && options.endY || 50,
                speed = options && options.speed || 0;

            if(lty1 <= startY){
                lty1 = startY;
            }
            if(lty2 <= startY){
                lty2 = startY;
            }
            if(lty1 >= CANVAS_HEIGHT / 2){
                lty1 = CANVAS_HEIGHT / 2;
            }
            if(lty2 >= CANVAS_HEIGHT / 2){
                lty2 = CANVAS_HEIGHT / 2;
            }
            //console.log(options)
            var radius1 = (20 - speed) < 7 ? 7 : (20 - speed);
            var radius2 = (10 - speed) < 5 ? 5 : (10 - speed);
            if(radius2 <= 5){
                return false;
            }
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            self.drawCircle(context, { x: 100, y: 50, r: radius1, sa:0, ea: Math.PI * 2 });
            self.drawCircle(context, { x: 100, y: lty2, r: radius2, sa:0, ea: Math.PI * 2 });

            context.save();
            context.beginPath();
            context.fillStyle = 'rgba(100,100,180,1)';
            context.strokeStyle = 'rgba(100,100,180,0)';
            context.lineWidth = 1;
            context.moveTo(startX, startY);
            //context.quadraticCurveTo(startX + 3,startY,ltx1,lty1);
            context.lineTo(ltx1, lty1);
            context.lineTo(ltx2, lty2);
            context.lineTo(endX, endY);
            //context.quadraticCurveTo(ltx2 + 7, endY,  endX, endY);
            //context.stroke();
            context.fill();
            context.closePath();
            context.restore();

            //画图标
            self.drawLoadIcon(context, {speed: speed, isLafe: true});

        },

        //画刷新图标
        drawLoadIcon: function(context, options){
            var self = this;

            var x = options && options.x || 100,
                y = options && options.y || 50,
                r = options && options.r || 10,
                sa = options && options.sa || 0,
                ea = options && options.ea || Math.PI * 2,
                speed = options && options.speed || 0,
                isLafe = options && options.isLafe || false;

            context.save();
            context.beginPath();
            context.strokeStyle = 'rgba(230,230,230,1)';
            context.lineWidth = 5 - speed < 3 ? 3 : 5-speed;
            context.arc(x, y, r - speed / 3, sa, ea, false);
            context.stroke();
            if(!isLafe){
                context.fillStyle = 'rgba(100,100,180,1)';
                context.fillRect(100 + speed, 37 + speed, 13 - speed, 13 - speed);
            }
            context.closePath();
            context.restore();

            //三角形
            if(!isLafe){
                context.save();
                context.beginPath();
                context.fillStyle = 'rgba(230,230,230,1)';
                context.moveTo(100 + speed, 35 + speed);
                context.lineTo(110 - speed, 40 + speed);
                context.lineTo(100 + speed, 45 + speed);
                context.fill();
                context.closePath();
                context.restore();
            }
        },

        /**
         * 开始加载数据
         */
        loadStart: function(context){
            var self = this;
            console.log(context)
            //context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            //self.drawImage(context, 'images/5-121204193R5-50.gif');
        }
    });
    return loadDataView;
});