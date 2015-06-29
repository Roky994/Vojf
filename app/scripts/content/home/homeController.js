define(['sigma', 'jQuery'], function(sigma, $) {
    
	return function($scope, $http, $location, apiService) {

		$scope.searchHeight = "height45";
		$scope.findNodeById = function() {};

		$scope.autocomplete();

		$scope.onSelect = function(id) {
			$scope.nodeId = id.bu_code.toString();
		}

		// Draw graph for given node
		$scope.findNode = function() {
			$location.path("/mainGraph/" + $scope.nodeId);
		}

		$scope.parseUrl();

	}
})