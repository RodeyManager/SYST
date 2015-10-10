/**
 * Created by Rodey on 2015/10/9.
 * Array Functions
 */

;(function(){

    function unique (arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++)
        {
            if (result.indexOf(arr[i]) == -1) result.push(arr[i]);
        }
        return result;
    }

    var tools = {

    };

})();