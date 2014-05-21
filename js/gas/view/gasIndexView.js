/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-14
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define(['chart', 'cuController/gasController'], function(Chart, gasController){

    //获取页面元素
    var decorationBox = $('#decoration_box');
    var decorationIsc = $('#decoration_iscroll');
    var decorationUl = decorationBox.find('ul');
    var decorationLi = decorationUl.find('li');
    var liw = 0;
    var lin = decorationLi.length;
    var dew = 0;

    var inbit_les       = $('#inbit-les'),
        ibbit_num       = $('#ibbit-num');
    var money_url       = $('#money_url'),
        money_name      = $('#money_name'),
        money_num       = $('#money_num'),
        culevel_num     = $('#culevel_num'),
        culevel_title   = $('#culevel_title'),
        nextLevel_num   = $('#nextLevel_num'),
        nextLevel_title = $('#nextLevel_title'),
        light_level     = $('#light_level'),
        light_level_b   = light_level.find('b');

    var gasIndexView = SYST.View({
        name: 'gasIndexView',
        controller: gasController,
        events:{
            // TOTO
        },
        init  :function(){
            var self = this;
            self.model = self.controller.getModel();
            self.itMonery = {};

            //console.log(window.Chart)
            //获取数据
            self.getmyItMoney();

        },

        getmyItMoney: function(){
            var self = this;
            decorationUl.html('');
            // ===>请求数据
            self.model.myItMoney({}, function(res){
                if(String(res.code) == '200'){
                    if(res.body){
                        decorationIsc.removeClass('charts-loading');
                        self.renderItMoney(res);
                    }else{
                        self.controller.tipDialog('获取数据失败，请重试！');
                    }
                }else{
                    self.controller.tipDialog('获取数据失败，请重试！');
                }
            });

        },
        renderItMoney: function(res){
            var self = this;
            //已获得的勋章列表
            self.itMonery.insigniaList = self.controller.parseRES(res.body.insigniaList);
            //饼图数据
            self.itMonery.tradeList = res.body.tradeList;
            //当前用户数据
            self.itMonery.currentUser = res.body;
            self.itMonery.currentUser.url = self.itMonery.currentUser.url.replace(/^<*|>*$/gi, '');
            //当前身份
            self.itMonery.grade = res.body.grade;
            //下一个身份等级
            self.itMonery.nestGrade = res.body.nestGrade;

            //渲染
            money_url.attr('src', self.itMonery.currentUser.url);      //头像地址
            money_name.text(self.itMonery.currentUser.name);           //用户名
            money_num.text(self.controller.fmoney(self.itMonery.currentUser.balance));         //当前余额
            culevel_num.text(self.controller.fmoney(self.itMonery.grade.coin));              //当前的历史财富
            culevel_title.text(self.itMonery.grade.name);              //当前身份
            nextLevel_num.text(self.controller.fmoney(self.itMonery.nestGrade.coin));        //下一个等级下限值
            nextLevel_title.text(self.itMonery.nestGrade.name);        //下个等级身份

            //升级显示
            var step = Math.floor((self.itMonery.nestGrade.coin - self.itMonery.grade.coin) / 5);
            var offset = (self.itMonery.currentUser.balance - self.itMonery.grade.coin);
            var msr = offset / step;
            self.controller.gradeCost(light_level_b, 'light_white', msr);

            //构建饼图
            var data = [], ps = [], color = [], style = '', total = 0;
            for(var i = 0; i < self.itMonery.tradeList.length; i++){
                var o = {}, c = {}, p = '';
                c.r = 195 - Math.floor(Math.random()*100);
                c.g = 235 - Math.floor(Math.random()*100);
                c.b = 145 - Math.floor(Math.random()*100);
                o.value = self.itMonery.tradeList[i].money;
                total += o.value;
                //o.color = 'rgb(' + c.r +','+ c.g +','+ c.b + ')';
                switch(self.itMonery.tradeList[i].type){
                    case 2:
                        o.name = '创新PK';
                        o.color = 'rgb(234, 95, 84)';
                        break;
                    case 3:
                        o.name = '专业达人';
                        o.color = 'rgb(72, 171, 255)';
                        break;
                    case 4:
                        o.name = '小伙伴';
                        o.color = 'rgb(255, 190, 25)';
                        break;
                    case 5:
                        o.name = '其他';
                        o.color = 'rgb(141, 201, 54)';
                        break;
                    default:
                        o.name = '其他';
                        o.color = 'rgb(0, 0, 0)';
                        break;
                };
                data.push(o);
                color.push(c);
                /*p = '<p class="bg_'+ 'rgb' + c.r +'-'+ c.g +'-'+ c.b + '' +'">'+ o.name +'</p>';
                ps.push(p);
                style = style + ' .pk_box b.bg_'+ 'rgb' + c.r +'-'+ c.g +'-'+ c.b + '' +':before{background:'+ o.color +';}';*/
            }
            style = '<style>' + style + '</style>';

            //饼图表示列表
            //inbit_les.html(ps.join(''));
            //inbit_les.before(style);
            ibbit_num.text(self.controller.fmoney(total));

            //初始化饼图
            self.doughnut(data);

            //以获得的勋章模板渲染
            var deHtml = template.render('decoration-tpl', { insigniaList: self.itMonery.insigniaList });
            decorationUl.html(deHtml);
            self.renderScroller();
            console.log(data)
        },
        renderScroller: function(){
            var self = this;

            decorationLi = decorationUl.find('li');
            liw = decorationLi.get(0).offsetWidth;
            lin = decorationLi.length;

            // 重置我已获得的勋章宽度
            for(var i = 0; i < lin; i++){
                dew += decorationLi.get(i).offsetWidth;
            }
            decorationUl.css('width', dew);
            // 将我已获得的勋章的盒子置为可滚动
            if(self.decorationUl_iscroller){
                self.decorationUl_iscroller.destroy();
            }
            self.decorationUl_iscroller = new iScroll(decorationIsc[0], {
                hScroll: true,
                vScroll: false,
                hScrollbar: false
            });

        },

        /**
         * 创建饼图
         */
        doughnut: function(data){
            var myDoughnut = new window.Chart(document.getElementById("canvas").getContext("2d")).Doughnut(data, {
                                animationEasing: 'easeOutExpo',
                                animationSteps: 80,
                                segmentShowStroke : true,
                                segmentStrokeWidth: 3,
                                segmentStrokeColor : "#c2e892",
                                percentageInnerCutout: 72,
                                animateRotate : true,
                                animateScale : false
                            });
        }
    });
    return gasIndexView;
});