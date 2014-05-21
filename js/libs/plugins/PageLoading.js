/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-4-9
 * Time: 下午1:50
 * To change this template use File | Settings | File Templates.
 */

/**
 * 页面加载组件
 *
 *
 *
 *
 *
 */


;(function(){

    //'use strict';

    var root = this;
    var gVars = {
        tpl:            //'<div class="loading-page" id="load-page" style="display:block;">'+
                        '<i class="icon"></i>'+
                        '<span class="txt">页面加载中...</span>',
                        //'</div>',
        now:            Date.now() || new Date().getTime(),
        time:           200,
        loadTitle:      '页面加载中...'
    };

    var PageLoading = function(options){
        var self = this;
        //宽度 x 高度
        self.height = document.body.clientHeight || document.documentElement.clientHeight;
        self.width = document.body.clientWidth || document.documentElement.clientWidth;

        self.opts = {
            intShow:    (options && options.intShow) ? options.iniShow : false,
            title:      (options && options.title) ? options.title : gVars.loadTitle,
            appCache:   (options && options.appCache) ? options.appCache : (window.applicationCache.status == 0 || window.applicationCache.status == 5) ? false : true
        };

        self.app = (function(){
            var app = undefined;
            var dom = document.body.children;
            if(dom[0].id == 'app'){
                app = dom[0];
            }else{
                for(var i = 0; i < dom.length; i++){
                    dom[i].style.display = 'none';
                    app.push(dom[i]);
                }
            }
            return app;
        })();

        self._load();
    };


    PageLoading.prototype._load = function(){
        var self = this;
        self.pageWrap = document.getElementById('load-page') || (function(){
            var div = document.createElement('div');
            div.setAttribute('class', 'loading-page');
            div.setAttribute('id', 'load-page');
            div.style.display = 'none';
            div.innerHTML = gVars.tpl;
            document.body.appendChild(div);
            return div;
        })();

        //console.log(self.pageWrap)
        var pageWrap = self.pageWrap;
        self.loadIcon  = pageWrap.getElementsByClassName('icon');
        self.loadTxt   = pageWrap.getElementsByClassName('txt');
        self.loadTxt.innerText = self.opts.title;


        pageWrap.style.width = self.width + 'px';
        //pageWrap.style.height = '100px';
        pageWrap.style.position = 'absolute';
        pageWrap.style.margin = '0 auto';
        pageWrap.style.textAlign = 'center';
        pageWrap.style.top = (self.height - pageWrap.clientHeight) / 2;
        pageWrap.style.left = '0px';

        if(self.opts.appCache){
            console.log('appcache')
           self._loadAppCache();
        }

    };
    PageLoading.prototype.show = function(){
         var self = this;
         if(self.app && typeof !self.app.length){
             self.app.style.display = 'none';
         }else{
             if(self.app.length > 0){
                 for(var i = 0; i < self.app.length; i++){
                    var dom = (self.app)[i];
                     dom.style.display = 'none';
                 }
             }
         }
         self.pageWrap.style.display = 'block';
    };

    PageLoading.prototype.hide = function(){
        var self = this;
        if(self.app && typeof !self.app.length){
            self.app.style.display = 'block';
        }else{
            if(self.app.length > 0){
                for(var i = 0; i < self.app.length; i++){
                    var dom = (self.app)[i];
                    dom.style.display = 'block';
                }
            }
        }
        self.pageWrap.style.display = 'none';
    };

    PageLoading.prototype._loadAppCache = function(){
        var self = this;
        var appCache = window.applicationCache;
        //首次检测缓存，最前触发
        appCache.addEventListener('checking', self._checking);
        //用户代理发现更新并且正在取资源，或者第一次下载manifest文件列表中列举的资源
        appCache.addEventListener('downing', self._downing);
        //用户代理正在下载资源manifest文件中的需要缓存的资源
        appCache.addEventListener('progress', self._progress);
        //已经下载完毕，并已经缓存
        appCache.addEventListener('cached', self._cached);
        //出错 401 || 410
        appCache.addEventListener('error', self._error);
        appCache.addEventListener('obsolete', self._obsolete);

    };

    PageLoading.prototype._checking = function(){

    };
    PageLoading.prototype._downing = function(){

    };
    PageLoading.prototype._progress = function(){

    };
    PageLoading.prototype._cached = function(){

    };
    PageLoading.prototype._error = function(){

    };
    PageLoading.prototype._obsolete = function(){

    };


    window.PageLoading = PageLoading;
    return PageLoading;

}).call(this);


