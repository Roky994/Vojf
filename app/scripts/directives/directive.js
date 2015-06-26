define(['./graphDirective/graphDirective', './searchDirective/searchDirective',
		'./legendDirective/legendDirective', './activeNodeDirective/activeNodeDirective',
		'./autocompleteDirective/autocompleteDirective'], function( graphDirective, searchDirective, legendDirective, activeNodeDirective, autocompleteDirective){
	
	var directives = {
		graphDirective: graphDirective,
		searchDirective: searchDirective,
		autocompleteDirective : autocompleteDirective,
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