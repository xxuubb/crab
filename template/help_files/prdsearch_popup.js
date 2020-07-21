(function(win){
	var prdsearch_popup = function(load_url, options){
		var $SC = $('#scroll_container'),popup_id = 'wp-prdsearch_popup';
		if ($('body > #'+popup_id).length > 0) return false;
		// Initialize
		var opts = $.extend({}, options||{}),maxh = opts.height||$(window).height(),
		ismobile = (typeof window.ontouchstart !== 'undefined'),
		$pnl = $('<div id="'+popup_id+'" style="left:'+(ismobile?0:$SC.offset().left)
			+'px;height:'+maxh+'px;"><a href="javascript:;" class="close">×</a>'
			+'<div class="searchpopup_body"></div></div>').appendTo("body");
		// Load content
		$.Deferred(function(dtd){
			var inerhtml = '<div class="wp-searchpopup_loading"><img src="'
			  +relativeToAbsoluteURL('template/default/images/loading.gif')+'" width="16" height="16" /></div>'
			  +'<iframe id="'+popup_id+'_frame" allowtransparency="true" frameborder="0" scrolling="auto" src="'
			  +load_url+'" width="320" height="'+maxh+'" onload="$(\'.wp-searchpopup_loading\',\'#'+popup_id+'\').remove()"></iframe>';
			dtd.resolve(inerhtml);return dtd.promise();
		}).done(function(data){$pnl.children('.searchpopup_body').html(data)})
		.fail(function(){alert(translate('Request failed!'));$pnl.triggerHandler('popupclose')});
		// Custom event
		$pnl.bind('popupclose', function(){$(this).remove();$SC.add(window).unbind('.searchpopup')});
		// Scroll event
		var $sckwin = $SC.children('.sitestar_sck_background');
		$SC.add(window).bind('scroll.searchpopup', function(){
			$pnl.css("top", $(this).scrollTop()+'px');
		}).bind('resize.searchpopup', function(){
			var maxh = Math.max($sckwin.height(), $(window).height());
			$pnl.height(maxh).find('iframe').height(maxh);
		});
		// Close event
		$pnl.children('a.close').click(function(){$pnl.triggerHandler('popupclose');return false});
	};
	win.prdsearch_popup = prdsearch_popup;
})(window);