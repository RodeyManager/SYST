/**
 * Created by Rodey on 2015/10/20.
 *
 * Ajax 方法
 */

;(function(SYST){



    var xhr = new XMLHttpRequest(),
        //defaulst params
        defs = {
            dataType: 'json',
            type: 'POST',
            async: true,
            timeout: 5000,
            crossDomain: true,
            header: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        };

    //callback ajax finish
    var format = function(text, type){
        var res = text;
        if('json' === type){
            try{ res = JSON.parse(text);        }catch(e){}
        }
        else if('text' === type){
            try{ res = JSON.stringify(text);    }catch(e){}
        }
        return res;
    };
    var callFunction = function(text, type, cb){
        var res = format(text, type);
        SYST.V.isFunction(cb) && cb(res);
    };

    var callComplate = function(xhr, type, cb){
        SYST.V.isFunction(cb) && cb(format(xhr.responseText, type), xhr);
    };

    /**
     * Ajax Method
     * @param options
     * options use exp: {
     *      url: '/list',
     *      data: { id: 2},
     *      type: 'GET',
     *      dataType: 'json',
     *      ajaxBefore: function(){},
     *      success: function(res){},
     *      error: function(err){},
     *      complate: function(res){}
     * }
     */
    var _ajax = function(options){
        if(SYST.V.isObject(options)){
            defs = SYST.extend(options, defs);
        }
        if(SYST.V.isEmpty(defs.url)) return;
        var data = defs.data,
            url = defs.type.toUpperCase() === 'GET' ? defs.url.split('?')[0] + SYST.T.paramData(defs.data, true) : defs.url,
            body = defs.type.toUpperCase() === 'GET' ? undefined : data,
            async = 'async' in defs ? defs.async : true;

        //open before 请求之前
        callFunction(undefined, defs.dataType, defs.ajaxBefore);

        xhr.open(defs.type, url, async);
        for(var k in defs.header){
            xhr.setRequestHeader(k, defs.header[k]);
        }
        xhr.onreadystatechange = function(){
           if(xhr.readyState === 4){
               xhr.onreadystatechange = null;
                if(xhr.status === 200){
                    callFunction(xhr.responseText, defs.dataType, defs.success);
                }else{
                    callFunction(xhr, defs.dataType, defs.error);
                }
               callComplate(xhr, defs.dataType, defs.complate);
            }
        };
        xhr.send(body);

    };

    if(SYST){
        SYST.ajax = _ajax;
        SYST.Model.prototype.ajax = _ajax;
    }

})(SYST);

