define(['jQuery'], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/scripts/directives/searchDirective/searchDirectiveTemplate.html',
			scope: {
				settings: '='
			},

			controller: function($scope, $timeout) {
			}
		}
	}

});