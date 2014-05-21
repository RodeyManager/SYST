/**
 * Created with JetBrains WebStorm.
 * User: EX-LUOYONG002 （Rodey -- www.senuu.com）
 * Date: 14-3-13
 * Time: 上午11:30
 * To change this template use File | Settings | File Templates.
 */

(function($){

    /**
     * Uploadify api
     */


    $("#fileupload").uploadify({
        'swf': 'uploadify.swf',
        'uploader': 'js/lib/uploadify/uploadify.swf',
        'script': url,
        'fileDataName': 'file', //必须，和以下input的name属性一致
        'formData': { 'key': key },
        'method': 'POST',
        'buttonImg': 'images/48__upload.png', //上传按钮背景
        'height': 64,  //按钮高度
        'width' : 64,  //按钮宽度
        'cancelImg': 'js/lib/uploadify/cancel.png', //取消上传按钮背景
        'queueID' : 'fileQueue', //和存放队列的DIV的id一致
        'auto'  : true, //是否自动开始
        'multi': false, //是否支持多文件上传
        'buttonText': '选择文件', //按钮上的文字
        'simUploadLimit' : 1, //一次同步上传的文件数目
        'queueSizeLimit' : 1, //队列中同时存在的文件个数限制
        'fileDesc': '支持格式:jpg/gif/jpeg/png.', //如果配置了以下的'fileExt'属性，那么这个属性是必须的
        'fileExt': '*.jpg;*.gif;*.jpeg;*.png',//允许的格式
        'sizeLimit': 204800,  //上传文件的大小限制，单位为字节 200k
        'overrideEvents': ['onSelect'], //设置需要覆盖系统的事件名称
        'preventCaching': Math.random() * 888, //一个随机数将被加载swf文件URL的后面，防止浏览器缓存
        'progressData': 'percentage', //设置文件上传时显示的数据，有两个选择：‘上传速度‘或者’百分比‘，分别对应’speed’和’percentage’
        //选择文件回调
        onSelect: function(event, queueID, fileObj){},
        //每个文件上传完成后回调
        onComplete: function (event, queueID, fileObj, response, data) {},
        //上传异常
        onError: function(event, queueID, fileObj) {},
        //取消上传
        onCancel: function(event, queueID, fileObj){},
        //当上传队列中的所有文件都完成上传时回调
        onAllComplete: function (event, data) {},
        /**
         * 每次上传文件更新进度时触发
         * @param file                  被上传的文件对象
         * @param bytesUploaded         文件已经被上传的byte数
         * @param bytesTotal            文件总的byte数
         * @param totalBytesUploaded    当前上传操作中总的byte数(所有文件)
         * @param totalBytesTotal       上传的总字节数（所有文件）
         */
        onUploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal){},
        //每个文件上传后触发
        onUploadSuccess: function(file, data, response){},
        //上传文件前触发
        onUploadStart: function(file){}
    });


});
