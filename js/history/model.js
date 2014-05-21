/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-1-20
 * Time: 上午9:16
 * To change this template use File | Settings | File Templates.
 */
define([], function(){

    var hisModel = SYST.Model({
        init: function(){
            //初始化页码
            this.page = 1;
            //每页数
            this.pageSize = 10;
        },
        getHisList: function(postData, su, fail){
            if(!postData || typeof postData !== 'object') return;
            var url = App.getWebServiceUrl('queryHis');
            this.doAjax(url, postData, su, fail);
        },


        /**
         * 格式化数据
         * @param rs
         * @return {*}
         */
        parseRs: function(rs){
            var self = this;
            if(!rs || typeof rs !== 'object') return;
            var allPubAccount = this.get('AllPubAccount');
            //console.log(allPubAccount)
            //处理结果集
            for(var i = 0; i < rs.length; i++){
                //rs[i].createTime = App.setDateFormat(+rs[i].createTime);
                //类型转换
                switch(Number(rs[i].msgType)){
                    //文字消息
                    case 0:
                        rs[i].msgTypeTXT = '文字消息';
                        //--
                        rs[i].mainBody = rs[i].message;
                        rs[i].mainTitle = rs[i].message;
                        rs[i].mainsTitle = SYST.T.subString(rs[i].message, 300);

                        break;
                    //图片消息
                    case 1:
                        rs[i].msgTypeTXT = '图片消息';
                        //--
                        rs[i].mainUrl = rs[i].message;
                        rs[i].mainTitle = rs[i].message;

                        break;
                    //语音消息
                    case 2:
                        rs[i].msgTypeTXT = '语音消息';
                        //--
                        //var ma = rs[i].message.match(/\/(\d*)$/i);
                        var ma = rs[i].message.substring(rs[i].message.lastIndexOf('/') + 1, rs[i].message.length);
                        rs[i].mainMaterialKey = ma;
                        rs[i].mainUrl = rs[i].message;
                        rs[i].mainTitle = rs[i].message;

                        break;
                    //视频消息
                    case 3:
                        rs[i].msgTypeTXT = '视频消息';
                        //--
                        //var ma = rs[i].message.match(/\/(\d*)$/i);
                        var ma = rs[i].message.substring(rs[i].message.lastIndexOf('/') + 1, rs[i].message.length);
                        rs[i].mainMaterialKey = ma;
                        rs[i].mainUrl = rs[i].message;
                        rs[i].mainTitle = rs[i].message;

                        break;
                    //图文消息
                    case 4 || 7 || 13:
                        rs[i].msgTypeTXT = '图文消息';
                        //----
                        //格式化内容
                        rs[i].message = JSON.parse(rs[i].message);
                        //主对象
                        rs[i].mainItem = rs[i].message.mainImageTextDTO;
                        rs[i].mainBody = rs[i].mainItem.body;
                        rs[i].mainUrl = rs[i].mainItem.body;
                        rs[i].mainTitle = rs[i].mainItem.title;
                        rs[i].mainMaterialkey = rs[i].mainItem.materialkey;
                        rs[i].mainPusernameStr = rs[i].mainItem.pusernameStr;
                        //子对象
                        rs[i].subItem = rs[i].message.subImageTextDTOList;

                        //循环子对象，截取标题
                        for(var j = 0; j < rs[i].subItem.length; j++){
                            (rs[i].subItem)[j].subTitle = SYST.T.subString((rs[i].subItem)[j].title, 30, ' ');
                        }


                        break;
                    //图文消息
                    default:
                        rs[i].msgTypeTXT = '图文消息';
                        //--
                        rs[i].mainUrl = rs[i].message;
                        rs[i].mainTitle = rs[i].message;
                        break;
                }
                rs[i].msgType = String(rs[i].msgType);
                //rs[i].messageType = Number(rs[i].messageType);
                //状态转换
                switch (Number(rs[i].status)){
                    case -1: rs[i].statusTXT = '待审核';       break;
                    case  0: rs[i].statusTXT = '已通过';       break;
                    case  1: rs[i].statusTXT = '发送完毕';     break;
                    case  2: rs[i].statusTXT = '正在发送';     break;
                    case  3: rs[i].statusTXT = '取消发送';     break;
                    case  9: rs[i].statusTXT = '已驳回';       break;
                }
                rs[i].status = Number(rs[i].status);

                rs[i].createTime = self.parseDate(SYST.T.setDateFormat(rs[i].createTime));

            }
            /*try{
                App.getFromUserHeadport(self.getFromUser(), function(data){
                    //alert(data)
                    rs.heardPort = data;
                });
            }catch(e){
                //console.log(78787)
            }*/
            console.log(rs)
            return rs;
        },

        /**
         * 格式化时间
         * @param dateString
         */
        parseDate: function(dateString){
            var dateS = [], timeS = [], y, m, d, h, ms, s;
            dateS = (dateString.split(/\s+/))[0].split('-');
            timeS = (dateString.split(/\s+/))[1].split(':');
            var znA= ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d'];
            var date = new Date();
            if(d == date.getDate()){
                return timeS.join(':');
            }
            return parseInt(dateS[1]) + '月' + parseInt(dateS[2]) + '日';
        },

        /**
         * 获取 当前用户ID
         * @return {*|String}
         */
        getFromUser: function(){
            //alert(SYST.T.getParams('fromUser'))
            return SYST.T.getParams('fromUser');
        },

        getPage: function(){
            return this.page || 1;
        },
        setPage: function(page){
            this.page = page || 1;
        },
        getPageSize: function(){
            return this.pageSize || 10;
        },
        setPageSize: function(size){
            this.pageSize = size || 10;
        }
    });
    return hisModel;
});
