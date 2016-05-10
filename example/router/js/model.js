/**
 * Created by Rodey on 2015/11/12.
 */

var userListModel = SYST.Model({
    init: function(){
        console.log('... init user list model ...');
    },
    test: function(d, s, f){
        this.$http.getJSON('../test.json', d, s, f);
    }
});
