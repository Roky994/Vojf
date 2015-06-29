define([
	'angular','angular-ui-router', 'scripts/content/home/homeController', 'scripts/content/mainGraph/mainGraphController',
	'scripts/content/atlasGraph/atlasGraphController', 'scripts/content/categoryGraph/categoryGraphController', 'scripts/content/instructions/instructionsController',
	'scripts/directives/directive', 'scripts/services/service', 'scripts/content/rootController/rootController',
	
	'angular-route', 'uiBootstrap'
	], function(angular, router, homeController, mainGraphController, 
		atlasGraphController, categoryGraphController, instructionsController,
		 directive, service, rootController) {

	var initialize = function() {

		var app = angular.module('sigmaJsApp', ['ngRoute', 'ui.bootstrap']);

		app.run(rootController);

		app.config(function($routeProvider) {
			$routeProvider.when('/home', {
				controller: homeController,
				templateUrl: 'app/scripts/content/home/homeTemplate.html'
			}).when('/mainGraph/:nodeId', {
				controller: mainGraphController,
				templateUrl: 'app/scripts/content/mainGraph/mainGraphTemplate.html',
				reloadOnSearch: false
			}).when('/atlasGraph/:nodeId', {
				controller: atlasGraphController,
				templateUrl: 'app/scripts/content/atlasGraph/atlasGraphTemplate.html'
            }).when('/instructions', {
				controller: instructionsController,
				templateUrl: 'app/scripts/content/'
			}).when('/categoryGraph/:nodeId', {
                controller: categoryGraphController,
                templateUrl: 'app/scripts/content/categoryGraph/categoryGraphTemplate.html'
			}).otherwise({
				redirectTo: '/home'
			});
		});
		
		

		directive.initialize(app);
		service.initialize(app);

		angular.bootstrap( document, [ 'sigmaJsApp' ] );

	}

	return {
		initialize: initialize
	};

});