/**
 * Created by r9luox on 2016/4/20.
 */
$(function(){
    var as = new SYST.Model();
    var str = '';
    for(var key in as){
        //if(!/^_/i.test(key)){
        str += '<li><a href="#SYST.R.' + key + '">.' + key + '</a></li>';
        //}
    }

    var listTpl = {
        '#header': './cate/header.html',
        '#st-config': './cate/SYST-Config.html',
        '#st-model': './cate/SYST-Model.html',
        '#st-shareModel': './cate/SYST-shareModel.html',
        '#st-view': './cate/SYST-View.html',
        '#st-controller': './cate/SYST-Controller.html',
        '#st-router': './cate/SYST-Router.html',
        '#st-tools': './cate/SYST-Tools.html',
        '#st-validate': './cate/SYST-Validate.html',
        '#st-http': './cate/SYST-Http.html',
        '#st-watcher': './cate/SYST-Watcher.html'
    };
    var index = 0,
        elmId,
        http = SYST.Http();

    function setHighlightBlock(){
        index++;
        if(index === Object.keys(listTpl).length){
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
            window.location.href = location.href;
            //关闭运行结果层
            $('.close-result-btn').on('click', function(evt){
                $(this).parent('.result').fadeOut(100);
            });
        }
    }

    function loadTpl(){
        for(elmId in listTpl){
            http.load(elmId, listTpl[elmId], setHighlightBlock);
        }
    }

    loadTpl();

});