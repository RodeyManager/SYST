/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-14
 * Time: 上午11:28
 * To change this template use File | Settings | File Templates.
 */

    // 模块自动解析，以便引入时使用 ( 使用此功能需要 html文件名 和 js文件夹的名称相同,区分大小写 )
require.config({
    paths : {
        cuModel         : 'js/gas/model',
        cuController    : 'js/gas/controller',
        cuView          : 'js/gas/view',
        cuTemplate      : 'js/gas/template',
        rsa             : 'js/libs/rsa/rsa.min',
        chart           : 'js/libs/chart/Chart.min'
    }
});


define(['cuModel/gasModel'], function(gasModel) {

    if($('script[data-appname]').attr('data-appname')){
        var appName = $('script[data-appname]').attr('data-appname');
    }
    if(appName != 'gasUMLogin'){
        //将用户打开的菜单地址记录下来
        redirectURL(appName + '.html');
        //验证是否已经绑定 um
        checkUMbind();
    }else{
        require(['cuView/gasUMLoginView'],function(gasUMLoginView){
            //console.log(gasUMLoginView);
            return gasUMLoginView;
        });
        return false;
    }

    function checkUMbind(){
        /** =====
         * 判断当前用户是否已经绑定,
         * 如果没有绑定则跳转到 UM 绑定页面
         * 如果已经绑定则直接跳转到对应页面
         * ===
         */
        /*console.log('UM Binding.......');
         var jid = SYST.T.Cookie('jid');
         var friendsession = SYST.T.Cookie('hm_sessionid') || SYST.T.getParams('hm_sessionid');
         $.ajax({
         url: App.getWebServiceUrl('loadSysRelativeByUsername'),
         type: 'post',
         data: {},
         dataType: 'json',
         success: function(res){
         if(String(res.code) == '701'){
         SYST.T.Cookie('jid', res.body.username || '');
         tipDialog({
         msg: "您还未进行UM绑定，请绑定UM！",
         type: 'danger',
         autoClose: true,
         closeTime: 3000,
         autoComplate: function(){
         alert(0)
         window.location.href = 'gasUMLogin.html';
         }
         });
         }
         },
         error: function(xhr, errorType){
         tipDialog({ msg: "网络异常，请重试！", type: 'danger', autoClose: true, closeTime: 3000 });
         //window.location.href = 'gasUMLogin.html';
         }
         });*/

        gasModel.loadSysRelativeByUsername({}, function(res){
            if(String(res.code) == '701'){
                //将jid存储到cookie中, 如果未绑定um，则跳转到UM绑定页面
                // um绑定需要传递当前用户的 jid
                SYST.T.Cookie('jid', res.body.username || '');
                tipDialog({
                    msg: "您还未进行UM绑定，请先绑定UM！",
                    type: 'danger',
                    autoClose: false,
                    closeTime: 2000,
                    autoComplate: function(){
                        //alert(0)
                        window.location.href = 'gasUMLogin.html';
                    }
                });
            }else if(String(res.code) == '700'){
                //主界面入口
                if($('script[data-appname]').attr('data-appname')){
                    var appName = $('script[data-appname]').attr('data-appname');

                    if(appName == 'gasInit'){
                        //redirectURL('gasInit.html');
                    }else if(appName == 'gasIndex'){
                        //redirectURL('gasIndex.html');
                        require(['text!cuTemplate/gasIndexTPL.html' ],function(gasIndexTPL ){
                            if(gasIndexTPL && gasIndexTPL != ''){
                                $('body').removeClass('page_loading').addClass('myItMoney').prepend(gasIndexTPL);
                                require(['cuView/gasIndexView'], function(gasIndexView){
                                    //console.log(gasIndexView);
                                    return gasIndexView;
                                });
                            }
                        });
                    }else if(appName == 'gasPK'){
                        //redirectURL('gasPK.html');
                        require(['text!cuTemplate/gasPKTPL.html' ],function(gasPKTPL ){
                            if(gasPKTPL && gasPKTPL != ''){
                                $('body').removeClass('page_loading').addClass('pkCharts').prepend(gasPKTPL);
                                require(['cuView/gasPKView'],function(gasPKView){
                                    //console.log(gasPKView);
                                    return gasPKView;
                                });
                            }
                        });

                    }/*else if(appName == 'gasUMLogin'){
                        require(['cuView/gasUMLoginView'],function(gasUMLoginView){
                            //console.log(gasUMLoginView);
                            return gasUMLoginView;
                        });
                    }*/
                }
            }
        });

    }

    function redirectURL(url){
        SYST.T.Cookie('redirectURL', url);
    }

});
