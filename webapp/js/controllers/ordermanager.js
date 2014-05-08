var orderCtrl = function($scope, $http, $location, $window, $filter, $modal) {
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
		i18n : 'zh-cn',
		showSelectionCheckbox : true,
		selectedItems : $scope.gridSelections,
		selectWithCheckboxOnly : true,
		columnDefs : [
				{
					field : 'orderid',
					displayName : '订单编号',
					cellTemplate : '<div class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>'
				}, {
					field : 'itemid',
					displayName : ''
				}, {
					field : 'itemname',
					displayName : '产品名称'
				}, {
					field : 'typname',
					displayName : '产品类型'
				}, {
					field : 'statname',
					displayName : '订单状态'
				} ],
		rowTemplate : '<div ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-dblclick="gridDBLClick(row.rowIndex)" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
	};
	$scope.confirm = function() {
		if ($scope.gridSelections.length > 0) {
			var orderids = "''";
			for (var i = 0; i < $scope.gridSelections.length; i++) {
				if ($scope.gridSelections[i].orderstate == '2') {
					$window.alert("订单编号为" + orderids + "的订单状态为已取消，不能进行确认");
					return;
				} else if ($scope.gridSelections[i].orderstate == '3') {
					$window.alert("订单编号为" + orderids + "的订单状态为已成交，不能进行确认");
					return;
				} else if ($scope.gridSelections[i].orderstate == '1') {
					$window.alert("订单编号为" + orderids + "的订单状态为已成交，不能重复确认");
					return;
				}
				orderids = "'" + $scope.gridSelections[i].orderid + "',"
						+ orderids;
			}
			$http({
				method : 'POST',
				url : '../spring/orders/confirm',
				data : {
					"orderids" : orderids
				}
			}).success(
					function(data, status, headers, config) {
						if (data.success == true) {
							$scope.gridSelections.splice(0,
									$scope.gridSelections.length);
							$scope.query();
							$window.alert('保存成功!');
						} else {
							$window.alert(data.msg);
						}
					}).error(function(data, status, headers, config) {
				$window.alert('保存异常!');
			});
		} else {
			$window.alert('请选择订单!');
		}
	};
	$scope.deal = function() {
		if ($scope.gridSelections.length > 0) {
			var orderids = "''";
			for (var i = 0; i < $scope.gridSelections.length; i++) {
				if ($scope.gridSelections[i].orderstate == '0') {
					$window.alert("订单编号为" + orderids + "的订单状态为预定，请先确认订单");
					return;
				} else if ($scope.gridSelections[i].orderstate == '2') {
					$window.alert("订单编号为" + orderids + "的订单状态为已取消，不能进行成交");
					return;
				} else if ($scope.gridSelections[i].orderstate == '3') {
					$window.alert("订单编号为" + orderids + "的订单状态为已成交，不能重复成交");
					return;
				}
				orderids = "'" + $scope.gridSelections[i].orderid + "',"
						+ orderids;
				// if(+$scope.gridSelections[i].orderstate)
			}
			$http({
				method : 'POST',
				url : '../spring/orders/deal',
				data : {
					"orderids" : orderids
				}
			}).success(
					function(data, status, headers, config) {
						if (data.success == true) {
							$scope.gridSelections.splice(0,
									$scope.gridSelections.length);
							$scope.query();
							$window.alert('订单成交成功!');
						} else {
							$window.alert(data.msg);
						}
					}).error(function(data, status, headers, config) {
				$window.alert('保存异常!');
			});
		} else {
			$window.alert('请选择订单!');
		}
	};
	$scope.cancel = function() {
		if ($scope.gridSelections.length > 0) {
			var orderids = "''";
			for (var i = 0; i < $scope.gridSelections.length; i++) {
				if ($scope.gridSelections[i].orderstate == '3') {
					$window.alert("订单编号为" + orderids + "的订单状态为已成交，不能取消订单");
					return;
				} else if ($scope.gridSelections[i].orderstate == '2') {
					$window.alert("订单编号为" + orderids + "的订单状态为已取消，不能重复取消");
					return;
				}
				orderids = "'" + $scope.gridSelections[i].orderid + "',"
						+ orderids;
				// if(+$scope.gridSelections[i].orderstate)
			}
			$http({
				method : 'POST',
				url : '../spring/orders/cancel',
				data : {
					"orderids" : orderids
				}
			}).success(
					function(data, status, headers, config) {
						if (data.success == true) {
							$scope.gridSelections.splice(0,
									$scope.gridSelections.length);
							$scope.query();
							$window.alert('取消成功!');
						} else {
							$window.alert(data.msg);
						}
					}).error(function(data, status, headers, config) {
				$window.alert('保存异常!');
			});
		} else {
			$window.alert('请选择订单!');
		}
	};
	// 双击事件
	$scope.gridDBLClick = function(index) {
		$scope.openEdit('orderContent.html', '订单详情', $scope.gridData[index],
				'img/icons/pencil.png', '../spring/orders/update');
	};

	$scope.openEdit = function(tempurl, title, data, ico, saveurl, orderid,
			reflesh) {
		$modal.open({
			templateUrl : tempurl,
			controller : orderModalInstanceCtrl,
			windowClass : 'winmodel',
			resolve : {
				title : function() {
					return title;
				},
				edit : function() {
					return data;
				},
				ico : function() {
					return ico;
				},
				reflesh : function() {
					return reflesh;
				},
				saveurl : function() {
					return saveurl;
				}

			}
		});
	};

	// 编辑数据

	$scope.add = function() {
		// $scope.editOpen = true;
		$scope.openEdit('myModalContent.html', '新增', initedit(),
				'img/icons/pencil.png', '../spring/users/add');
	};

	// 查询
	$scope.query = function() {
		if ($scope.queryType == '') {
			$scope.params = null;
		} else {
			$scope.params.orderstate = $scope.queryType;
		}

		$http({
			method : 'POST',
			url : '../spring/orders/list',
			data : {
				"page" : $scope.page,
				"params" : $scope.params

			}
		// , headers : {'Content-Type':'application/x-www-form-urlencoded;
		// charset=UTF-8'}
		}).success(function(data, status, headers, config) {
			console.log(data);
			if (data.success == true) {
				$scope.page = data.page;
				$scope.gridData = data.list;
			} else {
				$window.alert(data.msg);
			}
		}).error(function(data, status, headers, config) {
			$scope.msg = '查询异常!';
		});
	};
	// 分页的数据
	$scope.page = {
		pagecount : 0,
		currentpage : 1,
		pagesize : 15,
		rowcount : 0
	};
	$scope.params = {
		orderstate : $scope.queryType
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

var orderModalInstanceCtrl = function($scope, $modalInstance, $http, $window,
		title, edit, reflesh, saveurl, ico) {
	$scope.title = title;
	$scope.edit = edit;
	$scope.edit.price = edit.price+'元';
	$scope.ico = ico;
	$scope.showalert = false;
	$scope.close = function() {
		$modalInstance.close();
	};
	$scope.data = {

	};
	if ($scope.edit.orderstate == '0') {
		$scope.showconfirm = true;
		$scope.showcancel = true;
		$scope.showdeal = false;
	} else if ($scope.edit.orderstate == '1') {
		$scope.showconfirm = false;
		$scope.showcancel = true;
		$scope.showdeal = true;
	} else if ($scope.edit.orderstate == '2') {
		$scope.showconfirm = false;
		$scope.showcancel = false;
		$scope.showdeal = false;
	} else if ($scope.edit.orderstate == '3') {
		$scope.showconfirm = false;
		$scope.showcancel = false;
		$scope.showdeal = false;
	}

	$scope.params = {
		ordid : $scope.edit.orderid
	};

	$http({
		method : 'POST',
		url : '../spring/orders/queryorder',
		data : {
			// "page" : $scope.page,
			"params" : $scope.params
		}
	// , headers : {'Content-Type':'application/x-www-form-urlencoded;
	// charset=UTF-8'}
	}).success(function(data, status, headers, config) {
		console.log(data);
		if (data.success == true) {
			$scope.page = data.page;
			for (var i = 0; i < data.list.length; i++) {
				if (data.list[i].paramid == '1') {
					$scope.data.checkindate = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '2') {
					$scope.data.leftdate = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '3') {
					$scope.data.ordercount = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '4') {
					$scope.data.keepdate = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '5') {
					$scope.data.orderuser = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '6') {
					$scope.data.orderphone = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '7') {
					$scope.data.eatdate = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '8') {
					$scope.data.orderdate = data.list[i].paramvalue;
				} else if (data.list[i].paramid == '9') {
					$scope.data.begindate = data.list[i].paramvalue;
				}

			}

		} else {
			$window.alert(data.msg);
		}
	}).error(function(data, status, headers, config) {
		$scope.msg = '查询异常!';
	});

	function setAlert(success, msg, errmsg) {
		$scope.showalert = true;
		alert(success);
		if (success) {
			$scope.alerttype = "success";
			$scope.msg = msg;
		} else {
			$scope.alerttype = "error";
			$scope.msg = errmsg;
		}
	}
	
	$scope.update = function(state) {
		console.log($scope.edit);
		$http({
			method : 'POST',
			url : saveurl,
			data : {
				"orderids" : "'" + $scope.edit.orderid + "'",
				"state" : state
			}
		}).success(function(data, status, headers, config) {
			alert(data.success);
			setAlert(data.success, '保存成功!', data.msg);
		}).error(function(data, status, headers, config) {
			setAlert(false, null, '保存异常!');
		});
	};
};