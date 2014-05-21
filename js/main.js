/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002
 * Date: 13-12-25
 * Time: 下午6:16
 * To change this template use File | Settings | File Templates.
 */

//document.getElementById('app').style['height'] = document.documentElement.clientHeight + 'px';

require.config({
    baseUrl : '',
    shim : {
        'jQuery' : {
            exports : '$'
        },
        'jQuery.touch': {
            deps: ['jQuery']
        },
        'arttemplate' : {
            exports : 'template'
        },
        /*'underscore': {
            exports: '_'
        },*/
        'SYST' : {
            deps : ['jQuery', 'arttemplate'],
            exports: 'SYST'
        },
        /*datefield : {
            deps : ['touch','scroll','box'],
            exports : 'datefield'
        },
        scroll : {
            deps : ['touch'],
            exports : 'scroll'
        },*/
        'APPDateField':{
            deps: ['jQuery'],
            exports: 'APPDateField'
        },
        'tipDialog': {
            deps: ['jQuery']
        },
        'server': {
            deps: ['jQuery', 'SYST']
        },
        'APPSlider': {
            deps: ['jQuery', 'jQuery.touch'],
            exports: 'APPSlider'
        },
        'APPSearch': {
            deps: ['jQuery', 'jQuery.touch'],
            exports: 'APPSearch'
        }
    },
    paths : {
        text            : 'js/libs/require/text',
        jQuery          : 'js/libs/jquery/jquery-1.9.1',
        'jQuery.touch'  : 'js/libs/jquery/jquery.touch',
        arttemplate     : 'js/libs/art/artTemplate/arttemplate',
        /*underscore      : 'js/libs/underscore/underscore-min',
        'underscore.date'  : 'js/libs/underscore/plugins/underscore.date',
        'underscore.string': 'js/libs/underscore/plugins/underscore.string',*/
        iScroll         : 'js/libs/iscroll/iscroll',
        server          : 'js/libs/config/server',
        SYST            : 'js/libs/SYST/SYST',
        /*touch           : 'js/libs/datefield/touch',
        scroll          : 'js/libs/datefield/scroll',
        box             : 'js/libs/datefield/box',
        datefield       : 'js/libs/datefield/datefield',*/
        APPDateField    : 'js/libs/plugins/APPDateField',
        APPSlider       : 'js/libs/plugins/APPSlider',
        APPSearch       : 'js/libs/plugins/APPSearch',
        tipDialog       : 'js/libs/plugins/tipDialog',
        PageLoading     : 'js/libs/plugins/PageLoading'
    }
});
//引入公共js模块
define(['jQuery',
    'jQuery.touch',
    'arttemplate',
    'SYST',
    'APPSlider',
    'APPSearch',
    'APPDateField',
    'tipDialog',
    'PageLoading',
    'iScroll',
    'server',
    'text'], function($, undefined, template, SYST){

    /*=====显示加载页面加载插件=====*/
    //var pl = new PageLoading();
    //pl.show();


    //定义title列表数值
    var titlePrefix = '';
    var pageTitles = {
        'date': '日期选择组件',
        'slider': '移动滑块组件',
        'search': '搜索组件',
        'loadData': '刷新加载组件',
        'loadPage': '页面加载组件',
        'history': '查看历史消息',
        'scrollSide': '无缝滚动原理',
        '2048': '2048游戏'
    };

    //定位当前页面
    var page = location.href.match(/\w+(.do|.html)/ig);
    var currentPage = page ? page.join().match(/\w+/ig)[0] : "index";

    // 模块自动解析，以便引入时使用 ( 使用此功能需要 html文件名 和 js文件夹的名称相同,区分大小写 )
    require.config({
        paths : {
            currentModel        : 'js/'+ currentPage +'/model',
            currentController   : 'js/'+ currentPage +'/controller',
            currentView         : 'js/'+ currentPage +'/view',
            currentTemplate     : 'js/'+ currentPage +'/template',
            publicTempate       : 'tpl/public/'
        }
    });

    //固定头尾和导航添加处理
    require(['text!tpl/footer.html'], function(footerHTML){

        var body = $('body');
        body.append(footerHTML);

        //内容高度
        var mainApper = $('#app');
        mainApper.css('height', document.documentElement.clientHeight);

        var loadPage = $('#load-page'); //.css('top', $(window).outerHeight() / 2);
        var listMain = $('#list-main');
        /*$(document).ready(function(){
            //隐藏页面加载进度
            loadPage.hide();
            //显示页面内容
            listMain.show();
        });*/


        //本地开发，如果是本地环境，则将导航栏中的.do后缀换成.html----------------------------
        /*$(document).ready(function(){
            var navs = $('.header-Nav').find('a');
            if(App.testEnv == 'local'){
                $.each(navs, function(index, item){
                    $(item).attr('href', $(item).attr('href').replace(/.do$/gi, '.html'));
                });
            }
        });*/


        //改变title
        document.title = '【'+ pageTitles[currentPage] + '】-' + titlePrefix;
        //自动加载入口文件
        if($('script[data-app]').attr('data-app')){
            require([$('script[data-app]').attr('data-app')]);
        }else{
            require(['currentView']);
        }
        //require([$('script[data-app]').attr('data-app')]);
        //tipDialog('加载完毕', 'success');

        //处理 require 资源加载错误
        require.onError = function(error) {
            var failedItems = error.requireModules;
            for(var i = 0, len = failedItems.length; i < len; i++) {
                require.undef(failedItems[i]);
            }
        };

    });

});

