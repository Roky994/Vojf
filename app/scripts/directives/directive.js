define(['./graphDirective/graphDirective', './searchDirective/searchDirective',
		'./legendDirective/legendDirective', './activeNodeDirective/activeNodeDirective'], function( graphDirective, searchDirective, legendDirective, activeNodeDirective ){
	
	var directives = {
		graphDirective: graphDirective,
		searchDirective: searchDirective,
		legendDirective: legendDirective,
		activeNodeDirective: activeNodeDirective
	};

	var initialize = function( angModule ) {
		angular.forEach( directives, function( directive, name ) {
			angModule.directive( name, directive );
		})
	};

	return {
		initialize: initialize
	};

});