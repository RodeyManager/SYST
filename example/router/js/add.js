/**
 * Created by Rodey on 2015/11/12.
 */

var addController = function(){
    return {
        container: '#container',
        template: 'tpl/user_add.html',
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