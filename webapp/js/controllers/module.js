
var moduleCtrl = function($scope, $http, $location, $window, $filter, $modal) {
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
					field : 'modulename',
					displayName : '模块名称',
					cellTemplate : '<div class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>'
				}, {
					field : 'enabled',
					displayName : '是否有效'
				} ],
		rowTemplate : '<div ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-dblclick="gridDBLClick(row.rowIndex)" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
	};
	$scope.edit = function() {
		if ($scope.gridSelections.length > 0) {
			$scope.openEdit('moduleContent.html', '修改',
					$scope.gridSelections[0], 'img/icons/pencil.png',
					'../spring/modules/add');
			$scope.gridSelections.splice(0,
					$scope.gridSelections.length);
		}
	};
	$scope.del = function() {
		if ($scope.gridSelections.length > 0) {
			var item = $scope.gridSelections[0];
			var ids = '';
			for(var i = 0 ; i <  $scope.gridSelections.length;i++){
				ids += $scope.gridSelections[i].moduleid+",";
			}
			$http({
				method : 'POST',
				url : '../spring/modules/del/' + ids
			}).success(function(data, status, headers, config) {
				if (data.success == true) {
					$scope.gridSelections.splice(0,
							$scope.gridSelections.length);
					
					$window.alert('删除成功!');
					$scope.query();
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
		$scope.openEdit('moduleContent.html', '修改', $scope.gridData[index],
				'img/icons/pencil.png', '../spring/modules/add');
		
	};

	$scope.openEdit = function(tempurl, title, data, ico, saveurl) {
		$modal.open({
			templateUrl : tempurl,
			controller : moduleModalInstanceCtrl,
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
				saveurl : function() {
					return saveurl;
				}
			}
		});
	};

	// 编辑数据

	$scope.add = function() {
		// $scope.editOpen = true;
		$scope.openEdit('moduleContent.html', '新增', initedit(),
				'img/icons/pencil.png', '../spring/modules/add');
	};
	
	$scope.params = {
			modulename :  $scope.queryItem,
	}
		
	// 查询
	$scope.query = function() {
		if($scope.queryItem!=''){
			$scope.params.modulename = $scope.queryItem;
		}else{
			delete $scope.params.modulename;
		}
		
		$http({
			method : 'POST',
			url : '../spring/modules/list',
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

var moduleModalInstanceCtrl = function($scope, $modalInstance, $http, $window,
		title, edit, saveurl, ico) {
	$scope.title = title;
	$scope.edit = edit;
	$scope.ico = ico;
	$scope.showalert = false
	
	$scope.close = function() {
		$modalInstance.close();
	};
	// 重置
	$scope.reset = function() {
		$scope.edit = {
			checked : true
		};
	};
	function setAlert(success, msg, errmsg) {
		$scope.showalert = true;
		if (success) {
			$scope.alerttype = "success";
			$scope.msg = msg;
		} else {
			$scope.alerttype = "error";
			$scope.msg = errmsg;
		}

	}
	$scope.save = function() {
		console.log($scope.edit);
		$http({
			method : 'POST',
			url : saveurl,
			data : $scope.edit
		}).success(function(data, status, headers, config) {
			setAlert(data.success, '保存成功!', data.msg);
		}).error(function(data, status, headers, config) {
			setAlert(false, null, '保存异常!');
		});
	};
};