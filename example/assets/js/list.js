/**
 * Created by Rodey on 2015/11/12.
 */

var listController = {
    container: '#container',
    template: '../tpl/user_list.html',
    animate: 'fade',
    view: {
        triggerContainer: '#u-list',
        events: {
            'click li': 'liClick'
        },
        liClick: function(evt){
            console.log(evt.currentTarget.innerHTML);
        }
    },
    controller: {
        init: function(){
            //console.log(this.tpl);
            this.login();
        },
        login: function(){
            this.model.test({}, function(res){
                console.log(res);
            }, function(err){
                console.log(err);
            });
        }
    },
    model: userListModel,
    onDestroy: function(){
        console.log('list 路由销毁状态');
        return confirm('是否销毁当前路由，切换到指定路由？');
    }
};
