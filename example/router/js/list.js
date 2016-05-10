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
    ]
};

var view = SYST.View({

    unInit: true,
    model: userListModel,
    container: '#u-list',
    events: {
        'click li': 'liClick',
        'click #click-me': 'clickMe'
    },
    init: function(router){
        this.router = router;
        console.log(this.router.params);
        this.login();
    },
    liClick: function(evt){
        console.log(evt.currentTarget.innerHTML);
    },
    clickMe: function(evt){

    },
    login: function(){
        this.model.test(function(res){
            console.log(res);
        });
    }
});

var listController = {
    container: '#container',
    template: 'load@tpl/user_list.html',
    animate: 'fade',
    //isRender: true,
    data: data,
    //view: view,

    onReady: function(){
        console.log('list 路由开始渲染状态');
        this.router.view = view;
    },
    onRender: function(tpl){
        //this.container.html(SYST.T.render(tpl, { user: this.data }));
        $('#click-me').removeAttr('disabled');
    },
    onDestroy: function(){
        console.log('list 路由销毁状态');
        return confirm('是否销毁当前路由，切换到指定路由？');
    }

};
