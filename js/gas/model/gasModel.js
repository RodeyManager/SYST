/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-5-15
 * Time: 下午5:04
 * To change this template use File | Settings | File Templates.
 * To SYST Model template, see SYST JS FrameWork
 */

define([], function(){

    var friendsession = SYST.T.Cookie('hm_sessionid') || SYST.T.getParams('hm_sessionid');

    var gasModel = SYST.Model({
        name: 'gasModel',

        /**
         * 验证UM是否已经绑定
         */
        loadSysRelativeByUsername: function(postData, su, fail){
            if(!postData) return false;
            postData.friendsession = friendsession;
            var url = App.getWebServiceUrl('loadSysRelativeByUsername');
            this.doAjax(url, postData, su, function(){
                if(typeof fail === 'function') fail.call(this);
                tipDialog({msg: '网络异常，请重试！', autoClose: true, closeTime: 3000});
            }, {type: 'get'});
        },

        /**
         * UM验证
         */
        validateUM: function(postData, su, fail){
            if(!postData) return false;
            var url = App.getWebServiceUrl('validateUM');
            this.doAjax(url, postData, su, function(){
                if(typeof fail === 'function') fail.call(this);
                //tipDialog({msg: '网络异常，请重试！', autoClose: true, closeTime: 3000});
            });
        },

        bindUM: function(postData, su, fail){
            if(!postData) return false;
            postData.friendsession = friendsession;
            var url = App.getWebServiceUrl('createSysRelative');
            this.doAjax(url, postData, su, function(){
                if(typeof fail === 'function') fail.call(this);
                tipDialog({msg: '网络异常，请重试！', autoClose: true, closeTime: 3000});
            });
        },

        /**
         * 获取 gasIndex中信息
         */
        myItMoney: function(postData, su, fail){
            if(!postData) return false;
            postData.friendsession = friendsession;
            var url = App.getWebServiceUrl('myItMoney');
            this.doAjax(url, postData, su, function(){
                if(typeof fail === 'function') fail.call(this);
                tipDialog({msg: '网络异常，请重试！', autoClose: true, closeTime: 3000});
            }, {type: 'get'});
        },

        /**
         * 获取pk排行榜
         */
        itPK: function(postData, su, fail){
            if(!postData) return false;
            postData.friendsession = friendsession;
            var url = App.getWebServiceUrl('itPK');
            this.doAjax(url, postData, su, function(){
                if(typeof fail === 'function') fail.call(this);
                tipDialog({msg: '网络异常，请重试！', autoClose: true, closeTime: 3000});
            });
        }
    });
    return gasModel;
});