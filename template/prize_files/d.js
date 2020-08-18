/* Bottom navigator display */
;(function(win, $){
	var addHandler = function(el, type, handler){
		if(el.addEventListener) el.addEventListener(type, handler, false);
		else if(el.attachEvent) el.attachEvent("on"+type, handler);
		else el["on"+type] = handler;
	},msflag = false;
	// For ':active'
	addHandler(document.body, "touchstart", $.noop);
	// Initialize variables
	var $scontainer = $('body > #scroll_container'),ua = navigator.userAgent.toLowerCase(),
	$btmnav = $('body > #mphone_btmnav'),navH = $btmnav.outerHeight(),
	$sbcontainer = $scontainer.children('#scroll_container_bg');
	var $li = $btmnav.find('li'),$mpop = $('body > #mphone_morepop'),
	cln = $li.filter(':not(.more)').length,step = win.isHandheld?1:2,minliw = 60 * step;
	// Onload event
	$(win).bind("pageloaded", function(){
		var maxW = $scontainer.width(),btop = $sbcontainer.height();
		// 兼容其他底部浮动层
		var $fixedlayer = $scontainer.children('.fixedbottom');
		$fixedlayer.find(".price").height("auto");
		var indom = $fixedlayer.find(".price").outerHeight();
		if(indom>$fixedlayer.height()) $fixedlayer.height(indom);
		$fixedlayer.length && $fixedlayer.css("bottom", navH+'px');
		var $fixedlayer2 = $scontainer.find('.parametercon, .wzc_meau, .wkjdibubutton');
		$fixedlayer2.length && $fixedlayer2.css("bottom", navH+'px');
		// Mobile-website preview
		var scframw = 0, _hdname = $.cookie('hdname') || '';
		var regarr = /hdname=([a-z0-9]+)\b/i.exec(location.search);
		if (/^[a-z0-9]+$/i.test(_hdname) || regarr != null) {
			step = 1;minliw = 60;
			if (regarr != null) {
				_hdname = regarr[1];
				$.cookie('hdname', _hdname);
			}
			maxW = parent.$('#'+_hdname+'_frame').width();
			scframw = maxW;
		} else $.removeCookie('hdname');
		// Create placeholder
		var $placeholder = $scontainer.children('#mphone_placeholder');
		if(! $placeholder.length){ 
			$placeholder = $('<div id="mphone_placeholder"></div>').appendTo($scontainer);
			$placeholder.css({height: navH+'px',top: btop+'px'});
		}else{
			$scontainer.height(function(n, c){return c + navH});
			$sbcontainer.height(function(n, c){return c + navH});
		}
		// Reset container-height
		if(win.isHandheld && !msflag) $scontainer.height(function(n, c){return c + navH});
		msflag = true;
		// Reset navbar-positon
		var navleft = (/micromessenger/i.test(ua) && !/windowswechat/i.test(ua))?'auto':($scontainer.offset().left+'px');
		$btmnav.css({"bottom": '0px',"left": navleft,"width": maxW+'px',"visibility": 'visible'});
		// Reset column-style
		var liw = Math.floor(maxW / cln),uleft = 0;
		if (minliw > liw) {/* 'more' button */
			var moreW = 20 * step,actW = maxW - moreW,cln2 = Math.floor(actW / minliw);
			newliw = Math.max(minliw, Math.floor(actW / cln2));
			$li.filter(':lt('+cln2+')').width(newliw+'px').show().children('a').width(newliw+'px');
			$li.filter(':gt('+(cln2 - 1)+')').hide().filter('.more').show();
			// 'more' event
			$li.filter('.more').unbind("click").bind("click", function(){
				if($mpop.is(':visible')) return false;
				$li.filter(':hidden:not(.more)').clone(true).show().appendTo($mpop.children('ul').empty());
				if(scframw > 0) $mpop.css("max-width", '132px');
				$mpop.css({"bottom": (navH + 5)+'px',"right": ($scontainer.offset().left + 2 * step)+'px'}).show();
			});
		} else {
			$li.filter('.more').unbind("click").hide()
			.siblings().width(liw+'px').show().children('a').width(liw+'px');
			// Align center
			var diff = maxW - cln * liw,cln2 = cln,newliw = liw,uleft = Math.floor(diff / 2);
			if(diff > 0) $btmnav.find('ul').css("margin-left", uleft+'px');
		}
		// Highlight position
		var $hlight = $li.filter(':first.center');
		if ($hlight.length > 0) {
			var circlebgw = Math.max(56, $btmnav.find('.circlebg').width());
			var hindex = Math.ceil(cln2 / 2),mleft = Math.floor((newliw - circlebgw) / 2) + uleft/*(win.isHandheld?2:5) * step*/;
			$hlight.insertBefore($li.filter(':eq('+hindex+')')).show();
			$btmnav.find('.circlebg').css({"display": 'block',"left": (hindex - 1)*newliw+'px',"margin-left": mleft+'px'});
		}
		// Resize & Scroll
		var etype = (("orientation" in win) && ("onorientationchange" in win))?"orientationchange":"resize";
		$scontainer.add(this).bind(etype, function(e){
			// Destroy 'more' popup
			if($mpop.is(':visible')) $mpop.hide().children('ul').empty();
			// Reload
			$(win).triggerHandler("pageloaded");
			// Fixed low-version
			if(ua.indexOf('android 2.3') > -1) $btmnav.css('top', ($(this).height() - navH)+'px');
		}).bind("click", function(e){
			// Destroy 'more' popup
			if($mpop.is(':visible') && ! $(e.target).closest(['#mphone_btmnav','#mphone_morepop']).length)
				$mpop.hide().children('ul').empty();
		});
	}).load(function(){
		var sid = null;
		sid = setTimeout(function(){
			if(ua.indexOf('micromessenger') > -1 && ua.indexOf('mi 8') > -1){
				 var m = $("meta[name=viewport]"),mc=m.attr("content");
				 if(mc.indexOf('target-densitydpi=358') > -1){
					 m.attr("content","minimum-scale=1.0,maximum-scale=1.208,user-scalable=no,width=320,target-densitydpi=358");			
				 }
			 }
			if(msflag) return false;$(win).triggerHandler("pageloaded");clearTimeout(sid)}, 500);
	});
})(window, jQuery);