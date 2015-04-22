define([
	'angular','angular-ui-router', 'content/home/homeController', 'content/mainGraph/mainGraphController',
	'content/atlasGraph/atlasGraphController', './content/directives/directive',
	
	'angular-route' 
	], function(angular, router, homeController, mainGraphController, 
		atlasGraphController, directive) {

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
		
		directive.initialize(app);

		angular.bootstrap( document, [ 'sigmaJsApp' ] );


	}



	return {
		initialize: initialize
	};


});