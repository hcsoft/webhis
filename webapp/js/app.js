'use strict';

// Declare app level module which depends on filters, and services
/*
 * angular.module('myApp', ['myApp.filters', 'myApp.services',
 * 'myApp.directives']). config(['$routeProvider', function($routeProvider) {
 * $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html',
 * controller: MyCtrl1}); $routeProvider.when('/view2', {templateUrl:
 * 'partials/partial2.html', controller: MyCtrl2});
 * $routeProvider.otherwise({redirectTo: '/view1'}); }]);
 */
angular.module(
		'myApp',
		[ 'ui.router', 'myApp.filters', 'myApp.services', 'myApp.directives',
				'ui.bootstrap', 'ngGrid' ]).config(
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/login");
			$stateProvider.state('login', {
				url : '/login',
				templateUrl : 'html/login/login.html',
				controller : 'LoginCtrl'
			}).state('main', {
				url : '/main',
				templateUrl : 'html/main/main.html',
				controller : 'MainCtrl'
			});
		});