/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-1
 * Time: 下午5:33
 * To change this template use File | Settings | File Templates.
 */

define(['jQuery', 'APPDateField'], function($){

    var dateView = SYST.View({

        events: {
            'touchstart #choiesDate': 'appDate',
            'touchstart #date': 'appDate',
            'click #tips': 'tipDialog'
        },
        init: function(){

            var date = new Date();
            var val = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
            $('#date').val(val);

        },

        appDate: function(evt){
            var appDateField = new APPDateField('date', {
                isCN: true,       //是否显示中文, 如: " 2014年4月1日 "
                commer: '/',      //期间之间的间隔符, 默认为 "/"，当 isCN为 true时, 这个设置失效
                showYear: true,   //是否显示年份, 默认为显示 （true）
                showMonth: true,  //是否显示月份, 默认为显示 （true）
                showDate: true,   //是否显示日, 默认为显示 （true）
                complate: function(evt){  // "完成"按钮触发事件
                    console.log(this)
                    console.log(this.getCurrentDate(0,0,0));
                    console.log(this.currDate);
                    //alert(999)
                },
                cancel: function(evt){  // "取消"按钮触发事件
                    console.log('Cancel---');
                }
            });
        },

        tipDialog: function(evt){
            tipDialog({
                msg:'【公众号推荐】"理财宝宝大比拼"，新理财资讯一网打尽',  //内容
                title: '推送',
                type: 'success',                                     //状态
                btnOk: {                                             //确认按钮
                    val: '确认',                                     // 按钮文字
                    call: function(evt){                             // 确认按钮回调函数
                        console.log(evt)
                    },
                    close: true// 触发后是否关闭弹窗（ true: 关闭， false: 保留）
                },
                btnCancel:{
                    val: '关闭',
                    call: function(evt){
                        console.log(evt)
                    },
                    close: true
                }
            });
        },

        dateFm: function(n){
            return (n < 10) ? '0' + n : n;
        }


    });

    return dateView;
});
