/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-9
 * Time: 下午2:12
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define(['currentController'], function(T2048Ctroller){

    var nameView = SYST.View({
        model : T2048Ctroller.getModel(),
        controller: T2048Ctroller,
        events:{
            'click #newgamebutton': 'newGame',
            'keydown window': 'docKeydown'
        },
        /**
         * 初始化游戏结构布局
         */
        init  :function(){
            var self = this;

            self.board = new Array();
            self.score = 0;

            for(var i = 0; i < 4; i++){
                self.board[i] = new Array();
                for(var j = 0; j < 4; j++){
                    self.board[i][j] = 0;
                }
            }

            //初始化棋盘格
            this.initGame();
            //在随机两个各子间生成数字
            this.createNumber();
        },

        /**
         * 开始游戏
         */
        newGame: function(){
            //初始化棋盘格
            this.initGame();
            //在随机两个各子间生成数字
            this.createNumber();

            this.generateOneNumber();
            this.generateOneNumber();
        },

        initGame: function(){
            var self = this;
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){

                    var gridCell = $('#grid-cell-' + i + '-' + j);
                    gridCell.css('top', self.getPosTop(i, j));
                    gridCell.css('left', self.getPosLeft(i, j));
                }
            }
        },

        getPosTop: function(x, y){
            return 20 + x * 120;
        },

        getPosLeft: function(x, y){
            return 20 + y * 120;
        },

        getNumberBackgroundColor: function(numbre){
            switch(numbre){
                case 2: return '#eee4da'; break;
                case 4: return '#ede0c8'; break;
                case 8: return '#f2b179'; break;
                case 16: return '#f59563'; break;
                case 32: return '#f67e5f'; break;
                case 64: return '#f65e3b'; break;
                case 128: return '#edcf72'; break;
                case 256: return '#edcc61'; break;
                case 512: return '#9c0'; break;
                case 1024: return '#33b5e5'; break;
                case 2048: return '#09c'; break;
                case 4096: return '#a6c'; break;
                case 8192: return '#93c'; break;
            }

            return 'black';
        },

        getNumberColor: function(number){
            if(number < 4)
                return '#776e65';

            return 'white';
        },

        createNumber: function(){
            var self = this;
            $('.nember-cell').remove();
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    $('#grid-container').append('<div class="number-cell" id="number-cell-'+ i + '-' + j +'"></div>');
                    var theNumberCell = $('#number-cell-'+ i + '-' + j);

                    if(self.board[i][j] == 0){
                        theNumberCell.css({ width: '0px', height: '0px' });
                        theNumberCell.css({
                            top: self.getPosTop(i, j) + 50,
                            left: self.getPosLeft(i, j) + 50
                        });
                    }else{
                        theNumberCell.css({ width: '0px', height: '0px' });
                        theNumberCell.css({
                            top: self.getPosTop(i, j),
                            left: self.getPosLeft(i, j),
                            backgroundColor: self.getNumberBackgroundColor(self.board[i][j]),
                            color: self.getNumberColor(self.board[i][j])
                        });
                        theNumberCell.text(self.board[i][j]);
                    }

                }
            }
        },

        generateOneNumber: function(){
            var self = this;
            if(self.nospace(self.board)){
                return false;
            }

            //随机一个位
            var randx = parseInt(Math.floor(Math.random() * 4));
            var randy = parseInt(Math.floor(Math.random() * 4));

            while(true){
                if(self.board[randx][randy] == 0){
                    break;
                }

                randx = parseInt(Math.floor(Math.random() * 4));
                randy = parseInt(Math.floor(Math.random() * 4));
            }

            //随机一个数字
            var randNumber = Math.random() < 0.5 ? 2 : 4;

            //在随机位置显示数字
            self.board[randx][randy] = randNumber;

            self.showNumberAnimation(randx, randy, randNumber);

            //console.log(self.board)

            return true;
        },

        showNumberAnimation: function(i, j, ranNumber){
            var self = this;
            var numberCell = $('#number-cell-' + i +'-'+ j);
            numberCell.css('backgroundColor', self.getNumberBackgroundColor(ranNumber));
            numberCell.css('color', self.getNumberColor(ranNumber));
            numberCell.text(ranNumber);

            numberCell.animate({
                width: '100px',
                height: '100px',
                top: self.getPosTop(i, j),
                left: self.getPosLeft(i , j)
            }, 50);

        },

        nospace: function(){
            var self = this;
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    if(self.board[i][j] == 0){
                        return false
                    }
                }
            }

            return true;
        },

        docKeydown: function(evt){
            var self = this;
            switch(evt.keyCode){
                case 37: //left
                    if( self.moveLeft() ){
                        self.generateOneNumber();
                        self.isGameOver();
                    }
                    break;
                case 38: //up
                    if( self.moveUp() ){
                        self.generateOneNumber();
                        self.isGameOver();
                    }
                    break;
                case 39: //right
                    if( self.moveRight() ){
                        self.generateOneNumber();
                        self.isGameOver();
                    }
                    break;
                case 40: //down
                    if( self.moveDown() ){
                        self.generateOneNumber();
                        self.isGameOver();
                    }
                    break;
                default: //default
                    break;
            }
        },

        moveLeft: function(){
            var self = this;
            if(!self.canMoveLeft(self.board))
                return false;

            //moveLeft return true
            for(var i = 1; i < 4; i++){
                for(var j = 1; j < 4; j++){
                    if(self.board[i][j] != 0){
                        for(var k = 0; k < j; k++){
                            if(self.board[i][j] == 0 && self.noBlockHorizontal(i, k, j, self.board)){
                                //move
                                self.showMoveAnimate(i, j, i, k);
                                self.board[i][k] = self.board[i][j];
                                self.board[i][j] = 0;
                                continue;
                            }else if(self.board[i][k] == self.board[i][j] &&  self.noBlockHorizontal(i, k, j, self.board)){
                                //move
                                self.showMoveAnimate(i, j, i, k);
                                //add
                                self.board[i][k] += self.board[i][j];
                                self.board[i][j] = 0;
                                continue;
                            }
                        }
                    }
                }
            }

            setTimeout(function(){
                self.updateBoardView();
            }, 200);

            return true;
        },

        canMoveLeft: function(board){
            var self = this;
            for(var i = 1; i < 4; i++){
                for(var j = 1; j < 4; j++){
                    if(board[i][j] != 0)
                        if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                            return false;
                }
            }

            return true;
        },

        updateBoardView: function(){

        },

        noBlockHorizontal: function(row, col1, col2, board){
            var self = this;
            for(var i = col1 + 1; i < col2; i++){
                if( board[row][i] != 0){
                    return false;
                }
            }
            return true;
        },

        showMoveAnimate: function(fromx, fromy, tox, toy){
            var self = this;
            var numberCell = $('#number-cell-' + fromx +'-'+ fromy);

            numberCell.animate({
                top: self.getPosTop(tox, toy),
                left: self.getPosLeft(tox , toy)
            }, 200);
            numberCell
        },

        isGameOver: function(){

        }


    });
    return nameView;
});