;(function(SYST){

    var empty = function(){},
        defaults = {
            url: '',
            data: {},
            type: 'GET',
            dataType: 'json',
            async: true,
            crossDomain: false,
            cache: true,
            timeout: 0,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            accept: '*/*',
            headers: {},
            target: null,
            before: empty,
            success: empty,
            error: empty,
            complete: empty,
            stop: empty
        };

    function Ajax(options, callTarget){
        this.option = SYST.extend(defaults, options);
        this.response = null;
        this.target = callTarget || this.option.target || this;
        this.option.type = this.option.type.toUpperCase();
        this._init();
    }

    Ajax.prototype = {
        _init: function(){
            this.xhr = new XMLHttpRequest();
        },
        _onChangeState: function(){
            this.readyState = this.xhr.readyState;
            this.status = this.xhr.status;

            if(this.readyState == 4){
                this._close();
                if(this.status >= 200 && this.status <= 300){
                    if(this.xhr.responseType == 'arraybuffer' || this.xhr.responseType == 'blob'){
                        this.response = this.xhr.response;
                        this._onSuccess();
                    }else{
                        this._formatResponse(this.xhr.responseText);
                    }
                }else{
                    this._onError(this.status ? 'error' : 'abort', this.xhr.statusText);
                }
            }
        },
        send: function(body){
            var formData = this._toFormData(body || this.option.data),
                url = this.option.url;
            if(this.option.type === 'GET'){
                url = this.option.url + (this.option.url.indexOf('?') === -1 ? '?' : '&') + formData;
                url = url.replace(/[\?|\&]$/, '');
            }
            this.xhr.open(
                this.option.type,
                url,
                this.option.async,
                this.option.username,
                this.option.password
            );
            this.option.type !== 'POST' && this.setHeader('Content-Type', this.option.contentType);
            !this.option.crossDomain && this.setHeader('X-Requested-With', 'XMLHttpRequest');
            this.setHeaders(this.option.headers || {});
            this.setHeader('Accept', this.option.accept);
            if(this.option.mimeType && this.xhr.overrideMimeType){
                this.xhr.overrideMimeType(this.option.mimeType);
            }
            //提交前触犯
            if(this.option.before.apply(this.target, this._toParameters()) === false) return;
            this.xhr.onreadystatechange = this._onChangeState.bind(this);
            this.xhr.onload = this._onChangeState.bind(this);
            this.xhr.send(formData);
            if(this.option.timeout > 0)
                this._stim = setTimeout(function(){
                    this.off('timeout');
                }.bind(this), this.option.timeout);
        },
        on: function(event, handler){
            event = event.toUpperCase();
            handler = handler || empty;
            switch (event){
                case 'AJAX_BEFORE':
                    this.option.before = handler;
                    break;
                case 'AJAX_SUCCESS':
                    this.option.success = handler;
                    break;
                case 'AJAX_ERROR':
                    this.option.error = handler;
                    break;
                case 'AJAX_COMPLETE':
                    this.option.complete = handler;
                    break;
                default: break;
            }
            return this;
        },
        off: function(event, handler){
            if(event === 'abort' || event === 'timeout'){
                this._close();
                this.xhr.abort();
                this._onError(event);
            }
            if(handler) this.option.stop = handler;
            if(!SYST.V.isFunction(this.option.stop)){
                this.option.stop.apply(this.target, [this.xhr, 'stop']);
            }
            return this;
        },
        setHeader: function(name, value){
            this.xhr.setRequestHeader(name, value);
        },
        setHeaders: function(headers){
            SYST.T.each(headers, function(value, i, name){
                this.setHeader(name, value);
            }, this);
        },
        _close: function(){
            if(this._stim){
                clearTimeout(this._stim);
                this._stim = null;
            }
            this.xhr.onload = this.xhr.onerror = this.xhr.onreadystatechange = null;
        },
        _toParameters: function(status){
            return [this.response, this.xhr, status];
        },
        _toFormData: function(body){
            if(SYST.V.isString(body))   return body;
            var formData;
            if(this.option.type === 'POST' && window.FormData){
                formData = new window.FormData();
                SYST.T.each(body, function(v,i,k){
                    formData.append(k, v);
                }, this);
            }else{
                formData = SYST.T.serialize(body);
            }
            return formData;
        },
        _formatResponse: function(text){
            var result = text,
                dataType = this.option.dataType || (function(dt){
                        return dt.split(';')[0].split('/')[1];
                    })(this.xhr.getResponseHeader('content-Type')),
                error,
                domParser = new DOMParser();

            if(dataType == 'xml'){
                result = domParser.parseFromString(text, 'text/xml');
            }
            else if(dataType == 'html'){
                result = domParser.parseFromString(text, 'text/html');
            }
            else if(dataType == 'json'){
                try{
                    result = JSON.parse(text);
                }catch(e){
                    error = e;
                }
            }else{}

            this.response = result;
            error ? this._onError('parseError') : this._onSuccess();
        },
        _onSuccess: function(){
            this.option.success.apply(this.target, this._toParameters('success'));
            this._onComplete('success');
        },
        _onError: function(type, statusText){
            type = type || 'error';
            this.option.error.apply(this.target, [this.xhr, type, statusText]);
            this._onComplete(type);
        },
        _onComplete: function(type){
            this.option.complete.apply(this.target, [this.xhr, type || 'error']);
        }
    };

    function _request(type, dataType, url, data, success, error, option){
        var s = {url: url, data: data, type: type, dataType: dataType};
        s = SYST.extend(s, option || {});
        var ajax = new Ajax(s);
        ajax.on('AJAX_SUCCESS', success).on('AJAX_ERROR', error);
        ajax.send();
        return ajax;
    }

    function _load(loadType, dom, url, success, error, option){
        dom = /^#/.test(dom) ? [document.querySelector(dom)] : /^\./.test(dom) ? document.querySelectorAll(dom) : null;
        if(!dom)    throw 'no found elements';
        return Ajax.get(url, null, function(res){
            SYST.T.each(dom, function(element){
                element.innerHTML = res;
            });
            if(loadType == 'html'){
                var div = document.createElement('div');
                div.innerHTML = res;
                res = div;
            }
            success(res);
        }, function(err, xhr){
            SYST.V.isFunction(error) && error(err, xhr);
        }, SYST.extend(option, {dataType: 'text'}) );
    }
    Ajax.ajax = function(url, options){
        options = options || {};
        if(!SYST.V.isString(url)){
            options = url; url = undefined;
        }else{
            options.url = url;
        }
        var ajax = new Ajax(options);
        ajax.send();
        return ajax;
    };
    Ajax.post = function(url, data, success, error, option){
        return _request('POST', null, url, data, success, error, option);
    };
    Ajax.get = function(url, data, success, error, option){
        return _request('GET', null, url, data, success, error, option);
    };
    Ajax.getJSON = function(url, data, success, error, option){
        return _request('GET', 'json', url, data, success, error, option);
    };
    Ajax.load = function(dom, url, success, error, option){
        return _load('text', dom, url, success, error, option);
    };
    Ajax.loadHTML = function(dom, url, success, error, option){
        return _load('html', dom, url, success, error, option);
    };
    Ajax.fetch = function(url, init, type){
        init = init || {};
        var headers = init['headers'] || {},
            method = (init['method'] || 'post').toUpperCase(),
            body = init['body'];
        if(!'fetch' in window){
            var p = new SYST.Promise();
            var setting = SYST.extend(init, {
                url: url,
                data: body,
                type: method,
                dataType: type,
                success: function(res){ p.resolve(res); },
                error: function(err){   p.reject(err);  }
            });
            Ajax.ajax(setting);
            return p;
        }else{
            if(method == 'GET' || method == 'HEAD'){
                if(SYST.V.isObject(body))
                    url += SYST.T.paramData(body, true);
                else if(SYST.V.isString(body))
                    url += '?' + body;
                init['body'] = null;
                delete init['body'];
            }else{
                SYST.V.isObject(body) && (init['body'] = JSON.stringify(body));
            }
            return window['fetch'](url, init).then(function(res){
                return SYST.V.isFunction(res[type]) ? res[type]() : null;
            });
        }
    };

    SYST.Ajax = SYST.S = Ajax;

})(SYST);
