define(['./graphDirective/graphDirective'], function( graphDirective ){
	
	var directives = {
		graphDirective: graphDirective
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