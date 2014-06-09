/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-1-20
 * Time: 上午9:17
 * To change this template use File | Settings | File Templates.
 */
define(['currentModel'], function(hisModel){

    //拉取刷新元素
    //    var loading_list_top    = $('#loading-list-top');
    //    var loading_icon_top    = $('#loading-icon-top');
    var loading_list_bottom = $('#loading-list-bottom');
    var loading_icon_bottom = $('#loading-icon-bottom');

    //    var his_list_top    = $('#his-list-top');
    var his_list_bottom = $('#his-list-bottom');

    var loadPage = $('#load-page');
    var list_main = $('#list-main');
    var his_list_scroll = $('.his-list-scroll');

    var hisView = SYST.View({
        model: hisModel,
        events: {
            //'tap body': 'tipDialog'
        },
        init: function(){
            var self = this;
            //是否是最后一页
            self.isLastPage = false;
            self.lastID = 0;
            self.isLoading = false;

            //隐藏页面加载进度
            //loadPage.hide();

            list_main.hide();
            list_main.height(document.documentElement.clientHeight);

            //滚动
            self.iScoller = new iScroll(list_main[0], {
                checkDOMChanges: false,
                hideScrollbar: true,
                fadeScrollbar: true,
                onScrollMove: function(){
                    if(list_main.height() - this.y - 80 > $(this.scroller).height()){
                        loading_list_bottom.text('释放显示下10条');
                    }else{
                        loading_list_bottom.text('上拉显示下10条');
                    }
                    /*if(this.y >= 50){
                     loading_list_top.text('释放立即刷新');
                     }else{
                     loading_list_top.text('下拉立即刷新');
                     }*/
                    //console.log('this.y = '+ this.y)
                },
                onBeforeScrollEnd: function(){
                    //获取更新
                    /*if(this.y > 10){
                     loading_list_top.hide();
                     loading_icon_top.show();
                     //请求后台
                     self.getHisList('up');
                     }else{
                     loading_list_top.text('下拉立即刷新');
                     loading_list_top.show();
                     loading_icon_top.hide();
                     }*/
                },
                onScrollEnd: function(){
                    //获取历史
                    if(this.y - this.maxScrollY <= 0 && !self.isLastPage){
                        loading_list_bottom.hide();
                        loading_icon_bottom.show();
                        //请求后台
                        self.getHisList('down');
                    }else{
                        loading_list_bottom.text('上拉显示下10条');
                        loading_list_bottom.show();
                        loading_icon_bottom.hide();
                    }
                }
            });
            //初始化加载
            self.getHisList();

        },
        /**
         * 构建请求数据对象
         */
        getPostData: function(){
            var self = this;
            var fromUser = self.model.getFromUser() || null;
            var date = new Date(),
                y = date.getFullYear(),
                m = SYST.T.dateFm(date.getMonth() + 1),
                d = SYST.T.dateFm(date.getDate()),
                h = SYST.T.dateFm(date.getHours()),
                ms = SYST.T.dateFm(date.getMinutes()),
                s = SYST.T.dateFm(date.getSeconds()),
                sendTimeBegin = y + '-' + m + '-' + d + ' ' + h + ':' + ms + ':' + s,
                sendTimeEnd = y + '-' + m + '-' + d + ' ' + h + ':' + ms + ':' + s;
            if(self.lastID == 0){
                var postData = {
                    rowsPerPage: self.model.getPageSize,
                    fromUser: fromUser,
                    sendTimeBegin: null,
                    sendTimeEnd: null
                };
            }else{
                var postData = {
                    rowsPerPage: self.model.getPageSize,
                    fromUser: fromUser,
                    criticalMsgID: self.lastID, //上一次查询结果中数据的ID（与返回结果中的id对应）
                    rollDirection: 1, //翻页方向（0：向上翻页 1：向下翻页）
                    sendTimeBegin: null,
                    sendTimeEnd: null
                };
            }
            return postData;
        },
        /**
         * 获取历史消息
         */
        getHisList: function(type){
            var self = this, postDate; //commit
            if(self.isLoading) return;
            self.isLoading = true;
            var type = type || 'down';
            var nullList = document.getElementById('null-list') ? $('#null-list') : $('<li id="null-list">暂无历史消息</li>');
            if(nullList){
                nullList.hide();
            }else{
                his_list_bottom.before(nullList).hide();
            }

            var postData = self.getPostData();
            //console.log(self.model.page)
            //隐藏加载进度
            loadPage.hide();
            self.model.getHisList(postData, function(res){

                list_main.show();

                if(String(res.resultCode) == '0'){
                    if(res.resultMessage.length > 0){
                        //列表最后一条ID
                        self.lastID = (res.resultMessage)[res.resultMessage.length - 1].id;
                        //console.log(self.lastID)
                        //隐藏刷新加载元素
                        //loading_icon_top.hide();
                        loading_icon_bottom.hide();

                        //处理结果集
                        res.list = self.model.parseRs(res.resultMessage);

                        self.model.page++;
                        var html = template.render('his-list-tpl', { hisList: res.list });
                        if(type == 'down'){
                            his_list_bottom.before(html);
                        }else{
                            //his_list_top.after(html);
                            self.iScoller.scrollTo(0, 0);
                        }
                        self.iScoller.refresh();
                        //显示下拉提示
                        //loading_list_top.show();
                        loading_list_bottom.show();
                    }else{
                        self.isLastPage = true;
                        tipDialog({ msg: '全部加载完了！', type: 'success', autoClose: true, closeTime: 2000 });
                    }
                }else{
                    self.isLastPage = true;
                    tipDialog({ msg: '加载历史消息失败！', type: 'danger', autoClose: true, closeTime: 2000 });
                }

                self.isLoading = false;

            }, function(){
                self.isLastPage = true;
                tipDialog({ msg: '网络异常，请重试！', type: 'danger', autoClose: true, closeTime: 3000 });
            });
        },

        tipDialog: function(evt){
            //console.log(0);
        }

    });
    return hisView;
});
