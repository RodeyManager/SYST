/**
 * Created by Rodey on 2015/11/12.
 */

var userListModel = {
    init: function(){
        console.log('... init user list model ...');
    },
    test: function(d, s, f){
        this.doAjax('test.json', d, s, f);
    }
};
