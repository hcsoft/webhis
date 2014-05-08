//增加pageshow的事件防止图片切换失效
window.pagehasswiper = [ '#main', '#page3', '#introduce', '#purchase-promotions', '#follow', '#contact', '#purchase' ];
for ( var idx in window.pagehasswiper) {
	var selector = window.pagehasswiper[idx];
	$(selector).on('pageshow', null, selector, function(event, ui) {
		if (window.swipers[event.data]) {
			window.swipers[event.data].reInit();
		}
	});
}

$('#main').on(
		'pagebeforeshow',
		function(event, ui) {
			// 加载基础信息
			window.baseid = $.urlParam("id");
			$.querybaseinfo();
			if (window.baseinfo.success) {
				// 设置图片
				$.initPicSwiper("#main", window.baseinfo.piclist, "picurl");
				// 处理名称
				$("#main .main-title").html(window.baseinfo.baseinfo.title + $.format("<div class='star{0}'></div>", window.baseinfo.baseinfo.star));
				// 处理菜单
				$("#main .detail-menu").html("");
				for (var i = 0; i < window.baseinfo.menulist.length; i++) {
					var rowcls = "ui-block-a";
					if (i % 3 == 0) {
						rowcls = "ui-block-a";
					} else if (i % 3 == 1) {
						rowcls = "ui-block-b";
					} else if (i % 3 == 2) {
						rowcls = "ui-block-c";
					}
					var menu = window.baseinfo.menulist[i];
					var url = menu.url;
					if (url.indexOf("?") >= 0) {
						url = url + "&id=" + window.baseinfo.baseinfo.baseid;
					} else {
						url = url + "?id=" + window.baseinfo.baseinfo.baseid;
					}
					var html = ('<div class="{rowcls}"><div class="ui-bar "><a href="{url}" data-url-id="{id}"><span><img src="{pic}"></img></span><br>'
						+ '<span class="main_menu">{menuname}</span></a></div></div>');
					html = $.formatobject(html, {
						rowcls : rowcls,
						url : url,
						id : window.baseinfo.baseinfo.baseid,
						pic : menu.pic,
						menuname : menu.menuname
					});
					$("#main .detail-menu").append(html);
					$('#main .ui-bar a').button();
				}
			}
		});

$('#page3').on('pagebeforeshow', function(event, ui) {
	$.querybaseinfo();
	if (window.baseinfo.success) {
		$.initPicSwiper("#page3", window.baseinfo.intropiclist, "picurl");
		$("#page3 li a").each(function(idx) {
			var index = $(this).attr("href").indexOf("?");
			if (index >= 0) {
				$(this).attr("href", $(this).attr("href").substring(0, index) + "?id=" + $.urlParam("id"));
			} else {
				$(this).attr("href", $(this).attr("href") + "?id=" + $.urlParam("id"));
			}
		});
	}
});

$('#introduce').on('pagebeforeshow', function(event, ui) {
	$.querybaseinfo();
	if (window.baseinfo.success) {
		$.initPicSwiper("#introduce", window.baseinfo.intropiclist, "picurl");
		$("#intro-title").html(window.baseinfo.baseinfo.title);
		$("#intro-detail").html(window.baseinfo.baseinfo.description);
	}
});
$('#follow').on('pagebeforeshow', function(event, ui) {
	$.querybaseinfo();
	if (window.baseinfo.success) {
		$.initPicSwiper("#follow", window.baseinfo.intropiclist, "picurl");
		$("#follow .follow-title").html("关注" + window.baseinfo.baseinfo.title + "随时获取优惠信息");
		$("#follow .follow-wx-url").html(window.baseinfo.baseinfo.title);
		$("#follow .follow-wx-img").attr("src", window.baseinfo.baseinfo.wximg);
	}
});

$('#contact').on('pagebeforeshow', function(event, ui) {
	$.querybaseinfo();
	if (window.baseinfo.success) {
		$.initPicSwiper("#contact", window.baseinfo.intropiclist, "picurl");
		$("#contact-detail").html('');
		$("#contact-detail").append($.format('<li>电话： {0} <a href="tel:{0}" class="ui-link"><img src="app/mobile/img/ico-phone.png">点击拨打</a></li>', window.baseinfo.baseinfo.tel));
		$("#contact-detail").append($.format('<li>传真：{0}</li>', window.baseinfo.baseinfo.fax));
		$("#contact-detail").append($.format('<li>地址：{0}</li>', window.baseinfo.baseinfo.address));
	}
});

$('#page4').on(
		'pagebeforeshow',
		function(event, ui) {
			$.querybaseinfo();
			$.querypromotions();
			if (window.promotions.success) {
				$("#page4-list").html('');
				for ( var idx in window.promotions.promotionslist) {
					console.log(promotion);
					var promotion = window.promotions.promotionslist[idx];
					$("#page4-list").append(
							$.formatobject('<li>'
								+ '<div class="joinbox">'
								+ '<h4>{title}</h4>'
								+ '<p class="red text_r">{stataus}</p>'
								+ '<p>'
								+ '<a href="{url}?id={id}&promotionid={promotionid}">{description}</a>'
								+ '</p>'
								+ '</div>'
								+ '<div class="tooth"></div>'
								+ '<div>'
								+ '<a href="{url}?id={id}&promotionid={promotionid}" data-url-promotionid="{promotionid}" data-url-id="{id}"'
								+ ' class="btn-purchase {disabled}" data-role="button" data-mini="true" data-theme="e">立即参加</a>'
								+ '</div>'
								+ '</li>', {
								title : promotion.name,
								stataus : (promotion.valid == 1 ? '正在进行中' : '已结束'),
								description : promotion.description,
								url : promotion.url,
								promotionid : promotion.promotionid,
								disabled : (promotion.valid == 1 ? '' : 'ui-disabled'),
								id : $.urlParam("id")
							}));
				}
				$('#page4 .btn-purchase').button();
			}
		});
$('#purchase-promotions').on(
		'pagebeforeshow',
		function(event, ui) {
			$.querybaseinfo();
			if (window.baseinfo.success) {
				$("#purchase-promotions .follow-title").html("关注" + window.baseinfo.baseinfo.title + "随时获取优惠信息");
				$("#purchase-promotions .follow-wx-url").html(window.baseinfo.baseinfo.title);
				$("#purchase-promotions .follow-wx-img").attr("src", window.baseinfo.baseinfo.wximg);
				$("#purchase-promotions .focus").html('');
				$("#purchase-promotions .focus").append(
						$.format('<li>电话咨询：<span class="num blue">{0}</span><a  class="ui-link" href="tel:{0}"><img' + ' src="app/mobile/img/ico-phone.png">点击拨打</a></li>',
								window.baseinfo.baseinfo.tel));
			}
			$.querypromotions();
			if (window.promotions.success) {
				console.log(event);
				console.log(ui);
				// $.urlParam("promotionid")
				var promotion = window.promotionsmap[$.urlParam("promotionid")];
				$.initPicSwiper("#purchase-promotions", [ promotion.img ], null, true);
				var status = (promotion.valid == 1 ? '正在进行中' : '已结束');
				$('#promotion-text').html($.format('{0}<span class="green">{1}</span>', promotion.name, status));
				$('#purchase-promotions .text-content').html(promotion.description);
				$("#purchase-promotions .btn-purchase").attr("href", "==预留==");
			}

		});

function purchaseItem(currenturl, id, itemid, type, params) {
	jQuery.mobile.changePage("#purchase?id=" + id + "&itemid=" + itemid + "&type=" + type + "&" + params);
}
$('#booking')
		.on(
				'pagebeforeshow',
				function(event, ui) {
					$.querybaseinfo();
					$.querybookingitems();
					if (window.bookingitems.success) {
						// 生成首页的条件
						$("#booking .focus").html('');
						for ( var idx in window.bookingitems.typeparams) {
							var params = window.bookingitems.typeparams[idx];
							if (params[1].showmain) {
								var val = params[1].val;
								if (params[0].paramtype == 'date') {
									val = $.formatDateTime('yy-mm-dd', new Date());
								}
								$('#booking').data("page-params", $('#booking').data("page-params") + "&param_" + params[0].paramid + "=" + val);
								$("#booking .focus")
										.append(
												$
														.format(
																'<li><span sytle="width:20%;" noswap>{0}：</span><input type="{1}"  data-clear-btn="false" name="param_{2}" id="param_{2}" value="{3}" placeholder="{4}"></li>',
																params[0].paramname, params[0].paramtype, params[0].paramid, val, params[1].msg));
								$("#param_" + params[0].paramid).textinput();
							}
						}
						//设置标题
						$("#booking .booking-title").html(window.bookingitems.typename);
						// 生成预订列表
						var listview = $("#booking .itemlist");
						listview.html('');
						for ( var idx in window.bookingitems.itemlist) {
							var item = window.bookingitems.itemlist[idx];
							var html = '<li style="padding: 0px;"><fieldset class="ui-grid-a">'
								+ '<div class="ui-block-a" style="width: 80%">'
								+ '<div style="margin: 0px; width: 100%;" class="ui-btn-inner ui-li ui-li-has-alt">'
								+ '<div class="ui-btn-text">'
								+ '<a href="#" class="ui-link-inherit"> <img src="{pic}" class="ui-li-thumb">'
								+ '<h2 class="ui-li-heading">{name}</h2> <span class="word">￥<font class="money">{price}</font>&nbsp;<span class="{hasitem}">[{hasitemtext}]</span>'
								+ '</span></a>'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								+ '<div class="ui-block-b" style="width: 20%;">'
								+ '<a href="#" onclick=\'purchaseItem("{param1}","{param2}","{param3}","{param4}","{params}")\' data-role="button" data-mini="true" data-theme="e" class="btn-purchase {disable}">预订</a>'
								+ '</div>'
								+ '</fieldset></li>';
							var url = "?id=" + $.urlParam("id") + "&itemid=" + item.itemid;
							var hasitem = '';
							var valid = '';
							var hasitemtext;
							if (item.maxcount - item.currentcount > 0) {
								hasitem = 'hasitem';
								valid = '';
								hasitemtext = '有';
							} else {
								hasitem = 'noitem';
								valid = 'ui-disabled';
								hasitemtext = '无';
							}
							html = $.formatobject(html, {
								pic : item.img,
								name : item.itemname,
								price : item.price,
								hasitem : hasitem,
								url : url,
								disable : valid,
								hasitemtext : hasitemtext,
								param1 : window.location.href,
								param2 : $.urlParam("id"),
								param3 : item.itemid,
								param4 : $.urlParam("type"),
								params : $("#booking form").serialize()
							});
							listview.append(html);
						}
						listview.listview("refresh");
						$("#booking .itemlist .btn-purchase").button();
					}
				});

function booking() {
	console.log('booking');
	var flag = true;
	$('#purchase form input').each(function(idx) {
		if ($(this).data('required') == true) {
			var val = jQuery.trim($(this).val());
			if (!val) {
				alert($(this).data('requiretext') + '不能为空');
				$(this).focus();
				return false;
			} else {
				if ($(this).data('requiredlength') > 0 && $(this).data('requiredlength') > val.length) {
					alert($(this).data('requiretext') + '长度不够');
					$(this).focus();
					flag = false;
					return false;
				}
			}
		}
	});
	if (flag) {

		var params = $('#purchase form').serialize();
		console.log("{url:'" + escape(params) + "'}");
		$.ajax({
			type : "POST",
			contentType : "application/json",
			dataType : "json",
			async : false,
			url : "spring/mobile/booking/" + $.urlParam("id") + "/" + $.urlParam("type") + "/" + $.urlParam("itemid") + "?" + params,
			// data:"{}",
			cache : false,
			success : function(data) {
				if (data.success) {
					alert('预订成功!');
				}
			}
		});
	}
}

$('#purchase')
		.on(
				'pagebeforeshow',
				function(event, ui) {
					$.querybaseinfo();
					$.querybookingitems();
					if (window.bookingitems.success) {
						$("#purchase .focus.params").html('');
						var item = window.bookingitemmap[$.urlParam("itemid")];
						$("#purchase .purchase-title").html(item.itemname);
						$.initPicSwiper("#purchase", [ item.img ], null, true);
						for ( var idx in window.bookingitems.typeparams) {
							var params = window.bookingitems.typeparams[idx];
							var val = params[1].val;
							if (params[0].paramtype == 'date') {
								val = $.formatDateTime('yy-mm-dd', new Date());
							}
							if (!val) {
								val = '';
							}
							var name = params[0].paramname;
							if (params[1].required) {
								name = name + '<font color="red">*</font>'
							}
							var enable = '';
							if (!params[1].enable) {
								enable = 'disabled';
							}
							$('#purchase').data("page-params", $('#booking').data("page-params") + "&param_" + params[0].paramid + "=" + val);
							$("#purchase .focus.params")
									.append(
											$
													.format(
															'<li><div class="title-text" noswap>{0}：</div><input type="{1}" data-required="{6}" data-requiredlength="{8}"  data-clear-btn="false" name="param_{2}" id="param_{2}" value="{3}" {5} placeholder="{4}"  data-requiretext="{7}"></li>',
															name, params[0].paramtype, params[0].paramid, val, params[1].msg ? params[1].msg : '', enable, params[1].required, params[0].paramname,
															params[1].requiredlength));
							$("#purchase #param_" + params[0].paramid).textinput();
						}
						$("#purchase .focus.moneyli").html($.format('<li><div class="title-text" noswap>金额：</div> <div class="countmoney"><span>{0}</span>元</div></li>', item.price));
						$("#purchase .focus.params .ui-body").listview();
						$("#purchase a").button();
					}
				});

function queryOrders() {
	var tel = $('#param_6').val();
	queryorderbytel(tel);
	if(window.queryedorders && window.queryedorders.success){
		jQuery.mobile.changePage("#orderlist?id=" + $.urlParam("id") + "&tel=" + tel);
	}
}

function queryorderbytel(tel){
	// var params = $('#purchase form').serialize();
	$.ajax({
		type : "POST",
		contentType : "application/json",
		dataType : "json",
		async : false,
		url : "spring/mobile/queryorder/" + $.urlParam("id") + "/" + tel,
		// data:"{}",
		cache : false,
		success : function(data) {
			if (data.success) {
				window.queryedorders = data;
			}
		}
	});
}

function nullstr(str){
	return str?str:'';
}

$('#orderlist').on(
		'pagebeforeshow',
		function(event, ui) {
			queryorderbytel($.urlParam("tel"));
			if (window.queryedorders && window.queryedorders.success) {
				var listview = $("#orderlist .itemlist");
				listview.html('');
				console.log(window.queryedorders.ordlist);
				for ( var idx in window.queryedorders.ordlist) {
					var item = window.queryedorders.ordlist[idx];
					console.log(item);
					var html = '<li style="padding: 0px;"><fieldset class="ui-grid-a">'
						+ '<div class="ui-block-a" style="width: 60%">'
						+ '<div style="margin: 0px; width: 100%;" class="ui-btn-inner ui-li ui-li-has-alt">'
						+ '<div class="ui-btn-text">'
						+ '<a href="#" class="ui-link-inherit"> <img src="{pic}" class="ui-li-thumb">'
						+ '<h2 class="ui-li-heading">{name}</h2> <span class="word">￥<font class="money">{price}元</font>&nbsp;'
						+ '</span></a>'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="ui-block-b" style="width: 40%;">'
						+ '	数量：{count}<br>时间:{datebegin}'
						+ '</div>'
						+ '</fieldset></li>';
					html = $.formatobject(html, {
						pic : item.img,
						name : item.itemname,
						price : item.price,
							count: 	item.param_3,
						datebegin: nullstr(item.param_1)
					});
					listview.append(html);
				}
				listview.listview("refresh");
			}
		});