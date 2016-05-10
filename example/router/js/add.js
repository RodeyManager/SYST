/**
 * Created by Rodey on 2015/11/12.
 */

var addController = function(){
    return {
        container: '#container',
        data: { content: 'User Add' },
        //template: 'load@tpl/user_add.html',
        template: '<h1><%= content %></h1>',
        animate: 'fade',
        action: function(){
            console.log('......add action.....', this.params);
        },
        model: {
            init: function(){
                console.log('... init user add model ...');
            }
        }
    };
};