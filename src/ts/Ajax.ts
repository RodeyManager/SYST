/**
 * Created by Rodey on 2015/10/23.
 */

module YT{

    export class Ajax{

        public xhr: XMLHttpRequest;
        public setting: Object;
        private _v: YT.Validate;
        private _t: YT.Tools;

        public constructor(options?: Object){
            this._v = new YT.Validate();
            this._t = new YT.Tools();
            this.setting = {
                dataType: 'json',
                type: 'POST',
                async: true,
                timeout: 5000,
                crossDomain: true,
                header: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            };
            this.setting = ST.extend(options, this.setting);
            this.xhr = new XMLHttpRequest();
        }

        //callback ajax finish
        private _format(text, type){
            var res = text;
            if('json' === type){
                try{ res = JSON.parse(text);        }catch(e){}
            }
            else if('text' === type){
                try{ res = JSON.stringify(text);    }catch(e){}
            }
            return res;
        }

        private _callFunction(text, type, cb){
            var res = this._format(text, type);
            this._v.isFunction(cb) && cb(res);
        }

        private _callComplate(xhr, type, cb){
            this._v.isFunction(cb) && cb(this._format(xhr.responseText, type), xhr);
        }

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
        public request(options?: Object){
            var defs: Object;
            if(options && this._v.isObject(options)){
                defs = ST.extend(options, this.setting);
            }
            if(this._v.isEmpty(defs['url'])) return;
            var data: any = defs['data'],
                dataType: string = defs['dataType'],
                type: string = defs['type'],
                url: string = type.toUpperCase() === 'GET' ? defs['url'].split('?')[0] + this._t.paramData(defs['data'],true) : defs['url'],
                body: any = type.toUpperCase() === 'GET' ? undefined : data,
                header: Object = defs['header'],
                async: boolean = 'async' in defs ? defs['async'] : true;

            //open before 请求之前
            this._callFunction(undefined, dataType, defs['ajaxBefore']);

            this.xhr.open(type, url, async);
            for(var k in header){
                this.xhr.setRequestHeader(k, header[k]);
            }
            this.xhr.onreadystatechange = ()=>{
                if(this.xhr.readyState === 4){
                    this.xhr.onreadystatechange = null;
                    if(this.xhr.status === 200){
                        this._callFunction(this.xhr.responseText, dataType, defs['success']);
                    }else{
                        this._callFunction(this.xhr, dataType, defs['error']);
                    }
                    this._callComplate(this.xhr, dataType, defs['complate']);
                }
            };
            this.xhr.send(body);

        }

    }

}
