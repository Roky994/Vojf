define([
	'angular','angular-ui-router', 'content/home/homeController', 'content/mainGraph/mainGraphController',

	'angular-route' 
	], function(angular, router, homeController, mainGraphController) {

	var initialize = function() {
		var app = angular.module('sigmaJsApp', ['ngRoute']);

		app.config(function($routeProvider) {
			$routeProvider.when('/home', {
				controller: homeController,
				templateUrl: 'app/content/home/homeTemplate.html'
			}).when('/mainGraph', {
				controller: mainGraphController,
				templateUrl: 'app/content/mainGraph/mainGraphTemplate.html'
			}).otherwise({
				redirectTo: '/home'
			});
		});

		angular.bootstrap( document, [ 'sigmaJsApp' ] );

	}

	return {
		initialize: initialize
	};


});