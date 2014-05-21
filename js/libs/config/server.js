;(function() {
    window.App = window.App || new Object();
    /**
     * 常量定义
     */
    App.IS_DEBUG = false;

    // 服务器地址
    App.ServerHost = '';
    /**
//     * prd 环境会有cdn加速，其他环境没有可以用相对路径。
     */
    var webServiceUrls = {
        /* -------------趣味问答--------------- */
        //获取历史消息列表
        getAskList          : 'rest/question/queryQuestions',
        getARW              : 'rest/question/addAnswer',

        /* -------------我的it币--------------- */
        //验证UM
        validateUM                  : 'http://hm-iss-dmzstg1.pingan.com.cn/HM_ISS/validateUMinfo.do',
        //validateUM                  : 'http://hm-iss.pingan.com.cn/HM_ISS/validateUMinfo.do',
        //判断UM账号是否已绑定
        loadSysRelativeByUsername   : 'rest/station/loadSysRelativeByUsername',
        //绑定UM账号
        createSysRelative           : 'rest/station/createSysRelative',
        // 我的it币
        myItMoney                   : 'rest/station/myItMoney',
        // pk排名接口
        itPK                        : 'rest/station/pk'

    };

    App.testEnv = 'local'; // 强制使用某个环境(测试用),默认就设置为空

    var host = location.hostname;
    var href = window.location.href.replace(window.location.hash, '');
    var origin = window.location.origin;
    var port = window.location.port;
    var path = (window.location.pathname.split('/'))[1] ?
        (function(){
            //ex: http://10.13.48.189:8080/hm_smp_web/ask/answer.html
            //忽略前： ["", "hm_smp_web", "ask", "answer.html"]
            //忽略首尾元素
            //忽略后： ["hm_smp_web", "ask"]
            var p = (window.location.pathname.split('/')).slice(1, (window.location.pathname.split('/')).length - 1);
            var s = '';
            /* 所有path目录
             for(var i = 0; i < p.length; i++){
             (p[i].search(/.(html|do)/gi) <= 0) ? s += p[i] + '/' : s = '';
             }*/
            /* 只保留一级path目录 */
            p = p[0];
            (p.search(/.(html|do)/gi) <= 0) ? s += p + '/' : s = '';
            return s;
        })()
        : '';

    if(App.testEnv == 'stg' || App.testEnv == 'prd' || App.testEnv == ''){
        href = origin + '/' + path;  // 'http://localhost' + '/' + 'hm_smp_web' + '/'
        //测试环境
        App.ServerHost = href;
        console.log(href)

    }else if(App.testEnv == 'int' || host == '10.13.48.83'){
        //App.ServerHost = 'http://10.13.48.71:8080/hm-admin/'; //开发环境   （石冰鑫）
        //App.ServerHost = 'http://10.13.48.155:8080/hm-admin/'; //开发环境 （田磊锋）
        //App.ServerHost = 'http://10.13.50.213:8080/HMP/'; //开发环境 （张志军）
        //App.ServerHost = 'http://10.13.48.83:8080/hm_smp_web/'; //开发环境 （张海港）
        App.ServerHost = 'http://10.13.50.177:8080/hm_smp_web/'; //开发环境 （周钦炳）
        //开发环境
    }else if(App.testEnv == 'local'){
        var ma = (href.match(/[\w-]+.(html|do)/gi))[0];
        href = href.replace(ma, '');
        App.ServerHost = href; //'http://localhost/txt/interlocution/';
        // 会员登陆验证
        webServiceUrls = {
            /* -------------查看历史消息--------------- */
            //获取历史消息列表
            getAskList               : 'data/getAskList.json',
            getARW                   : 'data/getARW.json',

            /* -------------我的it币--------------- */
            //验证UM
            validateUM                  : 'http://hm-iss-dmzstg1.pingan.com.cn/HM_ISS/validateUMinfo.do',
            //isLogin                     : 'http://10.13.48.155:9002/HM_ISS/validateUMinfo.do',
            //判断UM账号是否已绑定
            loadSysRelativeByUsername   : 'data/gas/loadSysRelativeByUsername.json',
            //绑定UM账号
            createSysRelative           : 'data/gas/createSysRelative.json',
            // 我的it币
            myItMoney                   : 'data/gas/myItMoney.json',
            // pk排名接口
            itPK                        : 'data/gas/itPK.json'
        };
    }
    App.getWebServiceUrl = function(name) {
        //判断是否是UM验证接口
        if(name === 'validateUM'){
            if(App.evn == 'local'){
                //本地环境
                return App.ServerHost + webServiceUrls[name];
            }else{
                if(/test/gi.test(host) && port != ''){
                    //测试环境
                    webServiceUrls.isLogin = 'http://hm-iss-dmzstg1.pingan.com.cn/HM_ISS/validateUMinfo.do';
                }else{
                    //生产环境
                    webServiceUrls.isLogin = 'http://hm-iss.pingan.com.cn/HM_ISS/validateUMinfo.do';
                }
                return webServiceUrls[name];
            }
        }

        return App.ServerHost + webServiceUrls[name];
        return App.ServerHost + webServiceUrls[name];
    };

    //加密配置
    App.Rsa = {
        publicKey: "AEF3A75EBDDF588D2937F3F4C8A580EFDE2F7E1501FCE5987924E6DBBD0CCC56834CC31CE46B116E0368E57D79BDD26DD045C506139BCD726D3956CB06F6FFEF46DB08C856E18C2DF0D897BF6C8E82D816FA8644BBF47BB64DF4A55B5F2F5A1D65DB41E657AD8649E62A7A1DF2920269BBDC3C87CC5773C992996443AB23D50B",
        exponentNumber: "10001",
        isEncrypt: true
    };


    //=======================Native 相关================================


    /**
     * 分享
     * @param opts
     *
     opts = {
         heading:"",
         summary: "",//必须
         url: "",
         to: ""//必须 such as WeChat（微信） or WeChatMoments（微信朋友圈） or SinaWeibo（新浪微博）
    * }
     * /
     *
     */
    App.shareTo = function(opts){
        if(SYST.N.isNative){
            SYST.callNative('shareTo', opts);
        }else{}
    };

    /**
     * 分享到天下通朋友圈 ( Android 奇葩)
     * @constructor
     */
    App.toZone = function(heading, summary, url){
        if(SYST.N.isAndroid){
            SYST.callNative('toZone', heading, summary, url);
        }else{}
    };


}).call(this);
