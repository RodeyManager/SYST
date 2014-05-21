/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-14
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define(['cuController/gasController'], function(gasController){

    //获取页面元素
    var itmoney              = $('#itmoney');
    var chartsIscroll_other  = $('#charts-iscroll-other');
    var otherUl              = chartsIscroll_other.find('ul');
    var chartsIscroll_me     = $('#charts-iscroll-me');

    var meUl                 = chartsIscroll_me.find('ul');
    var meUlw                = 0;

    var gasPKView = SYST.View({
        name: 'gasPKView',
        controller: gasController,
        events:{
            //'tap #meITB': 'toMeITB'
            'tap #sharePK': 'share'
        },
        init  :function(){
            var self = this;
            self.model = self.controller.getModel();
            self.it = {};

            //console.log(self.controller)

            // 获取pk排行榜
            self.itPK();

        },

        /**
         * 获取pk排行榜
         * @param evt
         */
        itPK: function(){
            var self = this;
            // ==>请求数据
            self.model.itPK({}, function(res){
               if(String(res.code) == '200'){
                   if(res.body.result.topList && res.body.result.topList.length > 0){
                       chartsIscroll_other.removeClass('charts-loading');
                       chartsIscroll_me.removeClass('charts-loading');
                       self.renderPK(res);
                   }else{
                       self.controller.tipDialog('获取数据失败，请重试！');
                   }
               }else{
                   self.controller.tipDialog('获取数据失败，请重试！');
               }
            });
        },

        renderPK: function(res){
            var self = this;
            var res = res;
            //itmoney.html('');
            otherUl.html('');
            meUl.html('');

            //获取后台返回对应数据
            self.it.topList = self.controller.parseRES(res.body.result.topList);
            self.it.frontList = self.controller.parseRES(res.body.result.frontList);
            self.it.backList = self.controller.parseRES(res.body.result.backList);
            self.it.currentList = res.body.result;
            self.it.currentList.url = self.it.currentList.url.replace(/^<*|>*$/gi, '');
            //存储到模型中
            self.model.set('itPK', self.it);
            console.log(self.it)

            //渲染模板

            // -- 当前用户
            $('#itmoney-url').attr('src', self.it.currentList.url);
            $('#itmoney-name').text(self.it.currentList.name);
            $('#itmoney-rank').text(self.it.currentList.rank);
            $('#itmoney-balance').text(self.it.currentList.balance);
            //其他排行榜
            var renderData = { it: self.it };
            //var itmoneyHtml = template.render('itmoney-tpl', renderData);
            //itmoney.html(itmoneyHtml);
            var topHtml = template.render('charts-other-tpl', renderData);
            otherUl.html(topHtml);
            var meHtml = template.render('charts-me-tpl', renderData);
            meUl.html(meHtml);

            //渲染滚动
            self.renderScroller();

        },
        /**
         * 渲染滚动
         */
        renderScroller: function(){
            var self = this;
            //部门排行榜 滚动
            self.charts_other_Iscroller = new iScroll(chartsIscroll_other[0], {
                vScrollbar: false
            });

            //您的排名 滚动
            var meLi                 = meUl.find('li');
            var meLiw                = meLi.width();
            var meLin                = meLi.length;
            for(var i = 0; i < meLin; i++){
                meUlw += meLi.get(i).offsetWidth + 6;
            }
            //重置横向UL的宽度
            meUl.css('width', meUlw + 11);
            self.charts_me_Iscroller = new iScroll(chartsIscroll_me[0], {
                hScroll: true,
                vScroll: false,
                hScrollbar: false
            });
            //获取当前用户的排名li
            var currentLi = meUl.find('.current');
            //将当前用户现在是滚动的中心(初始化)
            var sx = -( currentLi.offset().left - chartsIscroll_me.width() / 2);
            //console.log(sx)
            self.charts_me_Iscroller.scrollTo(sx, 0);
        },

        share: function(evt){
            var self = this, target = $(evt.target);
            var type = target.attr('data-type') || 'TXTtMoments';
            var heading = document.title;
            var summary = "绿色加油站 - 我的IT币排行榜";
            var url = window.location.href.replace(window.location.hash, '');
            var opts = {
                heading: heading,
                summary: summary,
                //定义分享出去后的信息页面连接
                url: url,    //分享的URL
                to: type || 'TXTtMoments'
            };
            var sopts = JSON.stringify(opts);
            if(type == 'TXTtMoments' && SYST.N.isAndroid){
                App.toZone(opts.heading, opts.summary, opts.url);
            }else{
                App.shareTo(sopts);
            }
        },

        toMeITB: function(evt){
            window.location.href = 'gasIndex.html';
        }
    });
    return gasPKView;
});