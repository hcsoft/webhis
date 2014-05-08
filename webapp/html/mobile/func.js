$.urlParam = function(name) {
	var obj = $.mobile.path.parseUrl(window.location.href);
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(obj.hash);
	return  results && results[1] ? results[1]:null;
};
window.swipers = [];
$.initPicSwiper = function(selector, lists, type ,nopagination) {
	// 设置图片
	$(selector + " .swiper-wrapper").html('');
	if (type) {
		for (var i = 0; i < lists.length; i++) {
			$(selector + " .swiper-wrapper").append($.format('<div class="swiper-slide"><img src="{0}"></div>', lists[i][type]));
		}
	} else {
		for (var i = 0; i < lists.length; i++) {
			$(selector + " .swiper-wrapper").append($.format('<div class="swiper-slide"><img src="{0}"></div>', lists[i]));
		}
	}
	// 生成图片滑动
	if(!nopagination){
		window.swipers[selector] = new Swiper(selector + ' .swiper-container', {
			pagination : selector + ' .pagination',
			loop : true,
			paginationClickable : true,
			visibilityFullFit : true,
			grabCursor : true,
			initialSlide : 0
		});
	}else{
		window.swipers[selector] = new Swiper(selector + ' .swiper-container', {
			loop : true,
			paginationClickable : true,
			visibilityFullFit : true,
			grabCursor : true,
			initialSlide : 0
		});
	}
};
$.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};

$.formatarray = function() {
	var s = arguments[0];
	var arg = arguments[1];
	for (var i = 0; i < arg.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arg[i]);
	}
	return s;
};
$.formatobject = function() {
	var s = arguments[0];
	var arg = arguments[1];
	for ( var key in arg) {
		var reg = new RegExp("\\{" + key + "\\}", "gm");
		s = s.replace(reg, arg[key]);
	}
	return s;
};
$.querybaseinfo = function() {
	if (!window.baseinfo || !window.baseinfo.success) {
		var id = $.urlParam("id");
		$.ajax({
			type : "POST",
			async : false,
			url : "spring/mobile/baseinfo/" + id,
			cache : false,
			success : function(data) {
				window.baseinfo = data;
			}
		});
	}
};

$.querypromotions = function() {
	if (!window.promotions || !window.promotions.success) {
		var id = $.urlParam("id");
		$.ajax({
			type : "POST",
			async : false,
			url : "spring/mobile/promotions/" + id,
			cache : false,
			success : function(data) {
				window.promotions = data;
				window.promotionsmap = {};
				for(var idx in window.promotions.promotionslist){
					var promotion = window.promotions.promotionslist[idx];
					window.promotionsmap[promotion.promotionid] = promotion;
				}
				console.log(window.promotionsmap);
			}
		});
	}
};

$.querybookingitems = function() {
//	if (!window.bookingitems || !window.bookingitems.success) {
		var id = $.urlParam("id");
		var type = $.urlParam("type");
		$.ajax({
			type : "POST",
			async : false,
			url : "spring/mobile/bookingitems/" + id+"/"+type,
			cache : false,
			success : function(data) {
				window.bookingitems = data;
				console.log(data);
				window.bookingitemmap = {};
				for ( var idx in window.bookingitems.itemlist) {
					var item = window.bookingitems.itemlist[idx];
					window.bookingitemmap[item.itemid] = item;
				}
			}
		});
//	}
};
$.getData = function(obj,prefix){
	var data = obj.data();
	var pre = "data-"+prefix+"-";
	var ret = {};
	for (var p in data) {
	    if (data.hasOwnProperty(p) && p.toLowerCase().indexOf(pre)==0) {
	        var shortName = p.substr(pre.length);
	        ret[shortName] = data[p];
	    }
	}
	console.log("===ret===",ret);
	return ret;
};
$.gotopage= function(path,obj){
	$.mobile.changePage(path, {
		data : $.getData($(obj), "url")
	});
};