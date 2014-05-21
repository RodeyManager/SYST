/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-14
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 * To SYST View template, see SYST JS FrameWork
 */

define(['rsa', 'cuModel/gasModel'], function(RSAKey, gasModel){

    var errorTips = $('#errorTips');
    var loginBtn  = $('#login-loginBtn');
    var loading   = $('#login-loading');
    var userName  = $('#login-username');
    var userPawd  = $('#login-password');

    var redirectURL = SYST.T.Cookie('redirectURL') || SYST.T.getParams('redirectURL');

    var gasUMLoginView = SYST.View({
        name: 'gasUMLoginView',
        model : gasModel,
        events:{
            'tap #login-loginBtn': 'login',
            'keyup #login-password': 'pawdKeyUp'
        },
        init  :function(){
            var self = this;

            //初始化页面
            $('#errorTips').hide();
            $('#login-loading').hide();
            $('#login-loginBtn').removeClass('btn-add-gray');

            //是否正在登录中
            self.LOGINING = false;

        },

        pawdKeyUp: function(evt){
            var target = $(evt.target);
            var self = this;
            var pass = SYST.T.trim(target.val());
            if(pass.length != 0 || pass != ''){
                $('.ps-i').css({ 'backgroundPosition': '-64px center' });
            }else{
                $('.ps-i').css({ 'backgroundPosition': '-32px center' });
            }
        },

        /**
         * 提交登录
         * @param evt
         */
        login: function(evt){
            var self = this;
            var loginUser = {};
            if(self.LOGINING) return;
            self.LOGINING = true;
            loginBtn.addClass('btn-add-gray');

            loginUser.userName  = userName.val();
            loginUser.password  = userPawd.val();
            loginUser.jid       = SYST.T.Cookie('jid');
            loginUser.isRegister = 0; //代码是注册

            if('' == loginUser.userName) {
                self.resetBtn();
                errorTips.show().html('请输入UM号！');
                return false;
            }
            if(/^ex-/gi.test(loginUser.userName)){
                self.resetBtn();
                errorTips.show().html('非法的UM号！');
                return false;
            }
            if('' == loginUser.password) {
                self.resetBtn();
                errorTips.show().html('请输入UM密码！');
                return false;
            }
            if(!loginUser || !loginUser.userName) {
                self.resetBtn();
                errorTips.show().html('请检查输入您的UM号和密码！');
                return false;
            }

            /*if(App.Rsa.isEncrypt) {
                var toaPublicKeyStr = App.Rsa.publicKey;
                var exponentNumber = App.Rsa.exponentNumber;
                var rsaEn = new RSAKey();
                rsaEn.setPublic(toaPublicKeyStr, exponentNumber);
                //设置公钥和指数，应和后台商定
                loginUser.password = rsaEn.encrypt(loginUser.password);
                //加密
                if('' == loginUser.password) {
                    self.resetBtn();
                    $('#errorTips').show().html('请输入UM密码！');
                    return;
                }
                //$("#login-password").val(loginUser.password);
            }*/

            errorTips.hide();
            loading.html('正在努力验证中...').show();
            //将UNCount存放到cookie中
            SYST.T.Cookie('UMCount', loginUser.userName);
            console.log(loginUser);

            self.model.validateUM(loginUser, function(res){
                console.log(res);
                if(String(res.resultCode) != '0') {
                    self.resetBtn();
                    //错误
                    errorTips.show().html(res.erroMessage || '验证失败，请检查输入的UM号和密码！');
                } else {
                    errorTips.hide();
                    loading.show().html('正在绑定UM...');
                    /**
                     * -----um验证成功后调用 UM 绑定接口 进行绑定-----
                     */
                    self.bindUM(loginUser);
                }
            }, function(){
                self.resetBtn();
                //错误
                errorTips.show().html('网络异常，请重试！');
            });


        },

        /**
         * UM 绑定
         * @param loginUser
         * @return {Boolean}
         */
        bindUM: function(loginUser){
            var self = this;
            if(!loginUser || loginUser.length == 0) return false;
            var postData = {
                umNum    : loginUser.username,
                jid      : loginUser.jid
            };
            self.model.bindUM(postData, function(res){
                 if(String(res.code) == '200'){
                     loading.show().html('正在加载页面...');
                     window.location.href = redirectURL || 'gasIndex.html';
                 }else{
                     self.resetBtn();
                     //错误
                     errorTips.show().html(res.message || '绑定UM失败，请检查输入的UM号和密码！');
                 }
            });
        },

        /**
         * 重置提交按钮样式按钮
         */
        resetBtn: function(){
            this.LOGINING = false;
            loading.hide();
            loginBtn.removeClass('btn-add-gray');
        }
    });
    return gasUMLoginView;
});