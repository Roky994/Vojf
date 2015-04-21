define([
	'angular','angular-ui-router', 'content/home/homeController', 'content/mainGraph/mainGraphController',
	'content/atlasGraph/atlasGraphController',
	
	'angular-route' 
	], function(angular, router, homeController, mainGraphController, 
		atlasGraphController) {

	var initialize = function() {
		var app = angular.module('sigmaJsApp', ['ngRoute']);

		app.config(function($routeProvider) {
			$routeProvider.when('/home', {
				controller: homeController,
				templateUrl: 'app/content/home/homeTemplate.html'
			}).when('/mainGraph/:nodeId', {
				controller: mainGraphController,
				templateUrl: 'app/content/mainGraph/mainGraphTemplate.html'
			}).when('/atlasGraph/:nodeId', {
				controller: atlasGraphController,
				templateUrl: 'app/content/atlasGraph/atlasGraphTemplate.html'
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