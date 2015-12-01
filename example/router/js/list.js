/**
 * Created by Rodey on 2015/11/12.
 */


var data = {
    title: '-@- User List -@-',
        users: [
    { name: 'Tom', age: 23 },
    { name: 'Jack', age: 25 },
    { name: 'Summer', age: 32 },
    { name: 'Luber', age: 18 },
    { name: 'Rodey' }
]};

var listController = {
    container: '#container',
    template: 'tpl/user_list.html',
    animate: 'fade',
    data: data,

    onRender: function(tpl){
        console.log(tpl);
        $('#click-me').removeAttr('disabled');
    },
    view: {
        //triggerContainer: '#u-list',
        events: {
            'click li': 'liClick',
            'click #click-me': 'clickMe'
        },
        init: function(){
            console.log(this.params);
        },
        liClick: function(evt){
            console.log(evt.currentTarget.innerHTML);
        },
        clickMe: function(evt){

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
