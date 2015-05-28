define(['./graphDirective/graphDirective', './searchDirective/searchDirective'], function( graphDirective, searchDirective ){
	
	var directives = {
		graphDirective: graphDirective,
		searchDirective: searchDirective
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