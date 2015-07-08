define(['jQuery'], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/scripts/directives/activeNodeDirective/activeNodeDirectiveTemplate.html',
			controller: function($scope) {
				$scope.selectedTab = 0;
			}
		}
	}

});
