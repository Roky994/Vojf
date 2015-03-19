define([
	'angular','angular-ui-router', 'content/home/homeController', 

	'angular-route' 
	], function(angular, router, controller) {

	var initialize = function() {
		var app = angular.module('sigmaJsApp', ['ngRoute']);

		app.config(function($routeProvider){
			$routeProvider.when('/home', {
				controller: controller,
				templateUrl: 'app/content/home/homeTemplate.html'
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