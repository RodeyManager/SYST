SYST
====

SYST JS 是一个js MVC框架 功能比较纯粹简单, 使用起来也比较简单，里面有案例

 * 此框架依赖于: jQuery || Zepto || Ender   依赖于模板插件: Arttemplate || Underscore
 * 使用前请先引入依赖插件
 *
 * requireJS 引入:
 
 <pre>
		'SYST' : {
			deps : ['Zepto'],
			exports: 'SYST'
		}
 </pre>

 
 Model(模型创建)；
<pre>
 defaine([], function(){
    var model = SYST.Model({
        name: 'model----',
        init: function(){ // 初始化，如果没有可以不写 }

    });
    return model;
 });
</pre>

 Controller(控制器)
<pre>
 defaine(['model'], function(model){

    var controller = SYST.Controller({
        name: 'controller----;
        model: model,
        parseData: function(){
          // 格式化从后台请求的数据
        }
    });

    return controller;
 });
</pre>

 View(视图)
<pre>
  defaine(['controller'], function(controller){

    var view = SYST.View({
        name: 'view----;
        controller: controller,
        model: controller.getModel(),
        events: {
          'click document': 'domClick'
        },

        init: function(){ //初始化页面 },

        domClick: function(evt){
          var self = this;
          console.log(self);
          console.log(evt);
          alert('document click!!!');
        }
    });

    return view;
 });
</pre>

index.html；

		<!DOCTYPE html>
		<html>
		<head>
		  <meta charset="UTF-8" />
		  <title>SYST JS FRAMEWORK</title>
		</head>
		<body


		  <script src="js/libs/require/require.js"
				  data-main="js/libs/mian.js"
				  data-app="js/index/init.js"
				  data-appname="index"></script>
		</body>
		</html>

