define([
	'angular','angular-ui-router', 'scripts/content/home/homeController', 'scripts/content/mainGraph/mainGraphController',
	'scripts/content/atlasGraph/atlasGraphController', 'scripts/directives/directive',

	'angular-route' 
	], function(angular, router, homeController, mainGraphController, 
		atlasGraphController, directive) {

	var initialize = function() {
		var app = angular.module('sigmaJsApp', ['ngRoute']);

		app.config(function($routeProvider) {
			$routeProvider.when('/home', {
				controller: homeController,
				templateUrl: 'app/scripts/content/home/homeTemplate.html'
			}).when('/mainGraph/:nodeId', {
				controller: mainGraphController,
				templateUrl: 'app/scripts/content/mainGraph/categoryGraphTemplate.html'
			}).when('/atlasGraph/:nodeId', {
				controller: atlasGraphController,
				templateUrl: 'app/scripts/content/atlasGraph/atlasGraphTemplate.html'
            }).when('/atlasGraph/:nodeId', {
                controller: categoryGraphController,
                templateUrl: 'app/scripts/content/categoryGraph/categoryGraphTemplate.html'
			}).otherwise({
				redirectTo: '/home'
			});
		});
		
		directive.initialize(app);

		angular.bootstrap( document, [ 'sigmaJsApp' ] );

	}

	return {
		initialize: initialize
	};

});