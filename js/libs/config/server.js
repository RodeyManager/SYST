;(function() {
    window.App = window.App||new Object();
    /**
     * 常量定义
     */
    App.IS_DEBUG = false;
    var ua = navigator.userAgent.toUpperCase();

    // 服务器地址
    App.ServerHost = '';
    /**
//     * prd 环境会有cdn加速，其他环境没有可以用相对路径。
     */
    var webServiceUrls = {
        /* -------------查看历史消息--------------- */
        //获取历史消息列表
        getHisList                 : 'getHisList.do',
        queryHis                   : 'rest/queryForList_PublicMessage'
    };

    App.testEnv = 'int'; // 强制使用某个环境(测试用),默认就设置为空

    var host = location.hostname;
    if(App.testEnv =='stg'){
        //测试环境
        App.ServerHost = ''; // 测试环境用相对路径

    }else if(App.testEnv=='int' || host=='10.13.50.213'){
        //App.ServerHost = 'http://10.13.48.71:8080/hm-admin/'; //开发环境   （石冰鑫）
        //App.ServerHost = 'http://10.13.48.155:8080/hm-admin/'; //开发环境 （田磊锋）
        App.ServerHost = 'http://10.13.50.213:8080/HMP/'; //开发环境 （张志军）
        //开发环境
    }else if(App.testEnv == 'local'){
        App.ServerHost = '';//'http://localhost/';
        // 会员登陆验证
        webServiceUrls = {
            /* -------------查看历史消息--------------- */
            //获取历史消息列表
            getHisList                 : 'data/getHisList.json',
            queryHis                   : 'data/queryHis.json'
        };
    }
    App.getWebServiceUrl = function(name) {
        return App.ServerHost + webServiceUrls[name];
    };


    /**
     *------------------------- Native 相关 ----------------
     */


    /**
     * 获取天下通号 头像地址
     * @param fromUser
     * @param callback
     */
    App.getFromUserHeadport = function(fromUser, callback){
        if(SYST.N.isNative){
            SYST.N.callNative('getFromUserHeadport', fromUser, callback);
        }else{
            //var rs = '不是移动web应用'; || '{ "result":"NO","error":"不是移动web应用" }';
            var rs = 'http://pingan.qiniu.com/231234134456';
            if(typeof callback === 'function') callback(rs);
        }
    };


}).call(this);
