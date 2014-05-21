/**
 * A simple pager plugin for bootstrap UI.<br>
 * It has prev, next, first, last buttons and max 5 number buttons.<br>
 * Your should provide a div as a wrap container.<br>
 * Requres : jQuery.<br>
 * Use:
 * Create a pager : $(".bspager").bspager({pageSize : 30});<br>
 * Update pages and currentPage: $(".bspager").bspagerUpdate({currentPage : 2, pages : 9});<br>
 * @author EX-XUXUNHONG001
 * @date 2014-01-17
 * @since v0.01
 */
(function($){
	$.fn.bspager = function(options){
		function BootstrapPager(target, opt){
			this.target = target;
			this.opt = opt;
			this.page = 0;
			this.pages = 0;
			var rawHtml = 
				'<ul class="pagination">' +
                //'<li class="disabled"><a data="bspager-first" href="#">&laquo;'+this.opt.firstText+'</a></li>' +
                '<li class=""><a data="bspager-prev" href="#">'+this.opt.prevText+'</a></li>' +
                //'<li class="hidden"><a data="page-1" href="#">1</a></li>' +
                //'<li class="hidden"><a data="page-2" href="#">2</a></li>' +
                //'<li class="hidden"><a data="page-3" href="#">3</a></li>' +
                //'<li class="hidden"><a data="page-4" href="#">4</a></li>' +
                //'<li class="hidden"><a data="page-5" href="#">5</a></li>' +
                '<li class=""><a data="bspager-next" href="#">'+this.opt.nextText+'</a></li>' +
                //'<li class="disabled"><a data="bspager-last" href="#">'+this.opt.lastText+'&raquo;</a></li>' +
                '</ul>';
			$(this.target).html(rawHtml);
			this.bindEvent();
		}
		
		BootstrapPager.prototype = {
				update : function(currentPage, pages){
					this.page = currentPage;
					this.pages = pages;
					//if(currentPage > 0 && pages>0){
                    if(currentPage > 0){
						
						//show or hide the first, prev, next, last buttons
						//var first = $(this.target).find('ul.pagination li a[data=bspager-first]').parent();
						var prev = $(this.target).find('ul.pagination li a[data=bspager-prev]').parent();
						var next = $(this.target).find('ul.pagination li a[data=bspager-next]').parent();
						//var last = $(this.target).find('ul.pagination li a[data=bspager-last]').parent();
						if(currentPage == 1){
							//first.addClass('disabled');
							prev.addClass('disabled');
						}else{
							//first.removeClass('disabled');
							prev.removeClass('disabled');
						}
						if(currentPage == pages){
							next.addClass('disabled');
							//last.addClass('disabled');
						}else{
							next.removeClass('disabled');
							//last.removeClass('disabled');
						}
						
						//calc the start number button and the end number button
						var end = currentPage + 2;
						if(end > pages)
							end = pages;
						var start = end - 4;
						if(start < 1){
							end = 
							start = 1;
							end = pages<5 ? pages : 5;
						}
						
						//show or hide the number buttons
						var p = start;
						for(var i = 1; i<=5; i++){
							var item = $(this.target).find("ul.pagination li a[data='page-"+i+"']").parent();
							if(p == currentPage){
								item.addClass('disabled');
							}else{
								item.removeClass('disabled');
							}
							if(p<=end){
								if(item.hasClass('hidden'))
									item.removeClass('hidden');
								item.children("a").text(p);
							}else{
								if(!item.hasClass('hidden'))
									item.addClass('hidden');
							}
							p++;
						}
					}
				},
				bindEvent : function(){
					var self = this;
					$(this.target).find('ul.pagination li a').click(function(e){
						//disabled buttons, discard it.
						if($(this).parent().hasClass('disabled')){
							e.preventDefault();
							return false;
						}
						
						//get the target page
						var page = 0;
						/*if($(this).attr('data') == 'bspager-first'){
							page = 1;
						}else if($(this).attr('data') == 'bspager-prev'){
							page = self.page - 1;
						}else if($(this).attr('data') == 'bspager-next'){
							page = self.page + 1;
						}else if($(this).attr('data') == 'bspager-last'){
							page = self.pages;
						}else{
							page = parseInt($(this).text());
						}*/

                        if($(this).attr('data') == 'bspager-prev'){
                            page = self.page > 1 ? self.page - 1 : 1;
                        }else if($(this).attr('data') == 'bspager-next'){
                            page = self.page + 1;
                        }
						
						//invoke client callback, if has
						if(typeof self.opt.pagingCallback == 'function')
							self.opt.pagingCallback(page, self.opt.pageSize);
						
						//prevent the default behaviour of link
						e.preventDefault();
					});
				}
		};
		
		//default options
		var defaults = {
				pageSize : 30,
				prevText : '上一页',
				nextText : '下一页',
				firstText : '首页',
				lastText : '末页',
				pagingCallback : function(page, pageSize){
					alert("page:" + page + ", pageSize:" + pageSize);
				}
		};
		var opts = $.extend({}, defaults, options);
		
		return this.each(function(){
			var pager = new BootstrapPager(this, opts);
			$(this).data('pager', pager);
		});
	};
	
	$.fn.bspagerUpdate = function(currentPage, pages){
		return this.each(function(){
			var pager = $(this).data('pager');
			if(pager){
				pager.update(currentPage, pages);
			}
		});
	}
})(jQuery);