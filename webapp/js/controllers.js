'use strict';

/* Controllers */

var LoginCtrl = function($scope, $http, $location, loginService) {
	$scope.data = {};
	$scope.reset = function() {
		$scope.data.j_username = '';
		$scope.data.j_password = '';
		$scope.data.msg = '';
	};
	$scope.login = function() {
		$http({
			method : 'POST',
			url : 'spring/login',
			params : $scope.data
		}).success(function(data, status, headers, config) {
			console.log(data, status, headers, config);
			if (data.success == true) {
				loginService.setLogined(true);
				$location.path('/main');
				$location.replace();
			} else {
				$scope.data = data;
			}
		}).error(function(data, status, headers, config) {
			$scope.data.msg = '登录异常!';
		});
	};
};

var MainCtrl = function($scope, $http, $location, loginService) {
//	if (!loginService.logined) {
//		$location.path('/login');
//		$location.replace();
//	}
	$scope.menus = [ {
		text : '系统管理',
		icon : 'img/icons/setting.png',
		test : {
			background : "url(img/setting.png) norepeat"
		},
		child : [ {
			text : '菜单管理',
			img : 'img/menu/9.gif',
			url : 'systemmanager/menumanager.html'
		}, {
			text : '模块管理',
			img : 'img/menu/4.gif',
			url : 'systemmanager/modulemanager.html'
		}, {
			text : '用户管理',
			img : 'img/menu/7.gif',
			url : 'systemmanager/users.html'
		}, {
			text : '角色管理',
			img : 'img/menu/7.gif',
			url : 'systemmanager/rolemanager.html'
		}, {
			text : '用户管理测试',
			img : 'img/menu/7.gif',
			url : 'html/common/common.html',
			mod: 'user'
		}  ]
	}, {
		text : '主要功能',
		icon : 'img/icons/hypertension_manage_16_16.png',
		child : [ {
			text : '订单管理',
			img : 'img/menu/female_business_01.gif',
			url : 'order/ordermanager.html'
		} ]
	}, {
		text : '其他功能',
		icon : 'img/icons/query.png',
		child : [ {
			text : '统计查询',
			img : 'img/menu/25.gif',
			url : 'html/query.html'
		} ]
	} ];
	$scope.panes = [];
	$scope.clickmenu = function(name, url) {
		console.log($scope.panes);
		console.log($scope.panes.length);
		for (var i = 0; i < $scope.panes.length; i++) {
			console.log($scope.panes[i]);
			if (name == $scope.panes[i].title) {
				$scope.panes[i].active = true;
				return;
			}
		}
		$scope.panes[$scope.panes.length] = {
			title : name,
			active : true,
			url : url
		};
	};
	$scope.closetab = function(index){
		
		$scope.panes.splice(index, 1);
		/*
		for (var i = 0; i < $scope.panes.length; i++) {
			if (text == $scope.panes[i].title) {
				$scope.panes.splice(i, 1);
				$scope.$digest();
				return;
			}
		}*/
	};
	/*
	// 增加tab双击事件
	$(document).on("dblclick", ".nav-tabs a", function(e) {
		$scope.closetab(e.currentTarget.innerText);
	});
	
	$(document).on("mousedown", ".nav-tabs a", function(e) {
		if(event.which == 3){
			$scope.closetab(e.currentTarget.innerText);
		}
	});*/

};

/**/
var UsersCtrl = function($scope, $http, $location, $window, $filter, $modal) {
	// 初始化数据
	var initedit = function() {
		return {
			'enabled' : true
		};
	};
	// 显示列表
	$scope.gridData = [];
	$scope.gridSelections = [];
	$scope.gridOptions = {
		data : 'gridData',
		i18n: 'zh-cn',
		showSelectionCheckbox : true,
		selectedItems: $scope.gridSelections,
		selectWithCheckboxOnly:true,
		columnDefs : [
				{
					field : 'username',
					displayName : '用户名',
					cellTemplate : '<div class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>'
				}, {
					field : 'password',
					displayName : '密码'
				} , {
					field : 'enabled',
					displayName : '是否有效'
				}],
		rowTemplate : '<div ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-dblclick="gridDBLClick(row.rowIndex)" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
	};
	$scope.edit = function(){
		if($scope.gridSelections.length>0){
			$scope.openEdit('myModalContent.html','修改',$scope.gridSelections[0],'img/icons/pencil.png','../spring/users/add');
		}
	};
	$scope.del = function(){
		if($scope.gridSelections.length>0){
			var item = $scope.gridSelections[0];
			$http({
				method : 'POST',
				url : '../spring/users/del/'+item.username
			}).success(function(data, status, headers, config) {
				if (data.success == true) {
					var index = $scope.gridData.indexOf(item);
					$scope.gridData.splice(index,1);
					$window.alert('删除成功!');
				} else {
					$window.alert(data.msg);
				}
			}).error(function(data, status, headers, config) {
				$window.alert('保存异常!');
			});
		}
		return true;
	};
	// 双击事件
	$scope.gridDBLClick = function(index) {
		$scope.openEdit('myModalContent.html','修改',$scope.gridData[index],'img/icons/pencil.png','../spring/users/add');
	};
	
	$scope.openEdit = function(tempurl,title,data,ico,saveurl){
		$modal.open({
			templateUrl : tempurl,
			controller : ModalInstanceCtrl,
			windowClass: 'winmodel',
			resolve : {
				title:function() {
					return title;
				},
				edit : function() {
					return data;
				},
				ico:function() {
					return ico;
				},
				saveurl: function(){
					return saveurl;
				}
			}
		});
	};
	
	// 编辑数据

	$scope.add = function() {
		// $scope.editOpen = true;
		$scope.openEdit('myModalContent.html','新增',initedit(),'img/icons/pencil.png','../spring/users/add');
	};
	
	// 查询
	$scope.query = function() {
		$http({
			method : 'POST',
			url : '../spring/users/list',
			data : {
				"page" : $scope.page,
				"params" : $scope.params
			}
		//,	headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data, status, headers, config) {
			console.log(data);
			if (data.success == true) {
				$scope.page = data.page;
				$scope.gridData = data.list;
			} else {
				$window.alert(data.msg);
			}
		}).error(function(data, status, headers, config) {
			$scope.msg = '保存异常!';
		});
	};
	// 分页的数据
	$scope.page = {
		pagecount : 0,
		currentpage : 1,
		pagesize : 15,
		rowcount : 0
	};

	$scope.selectPage = function(pageNo) {
		$scope.page.currentpage = pageNo;
	};
	$scope.$watch('page.currentpage', function() {
		$scope.query();
	});
	function selectPage(pageNo) {
		$scope.page.currentpage = pageNo;
		;
	}
};



var ModalInstanceCtrl = function($scope, $modalInstance,$http,$window,title, edit ,saveurl,ico) {
	$scope.title = title;
	$scope.edit = edit;
	$scope.ico = ico;
	$scope.showalert = false;
	$scope.close = function() {
		$modalInstance.close();
	};
	// 重置
	$scope.reset = function() {
		alert('sdsd');
		$scope.edit = {checked:true};
	};
	function setAlert(success,msg,errmsg){
		$scope.showalert = true;
		if(success){
			if (data.success == true) {
				$scope.alerttype = "success";
				$scope.msg = msg;
			} else {
				$scope.alerttype = "error";
				$scope.msg = errmsg;
			}
		}
	}
	$scope.save = function() {
		console.log($scope.edit);
		$http({
			method : 'POST',
			url :  saveurl,
			data : $scope.edit
		}).success(function(data, status, headers, config) {
			setAlert($scope.success,'保存成功!',data.msg);
		}).error(function(data, status, headers, config) {
			setAlert(false,null,'保存异常!');
		});
	};
};
