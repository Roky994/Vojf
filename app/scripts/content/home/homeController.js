define(['sigma', 'jQuery'], function(sigma, $) {
    
	return function($scope, $http, $location, apiService) {

		$scope.searchHeight = "height45";
		$scope.findNodeById = function() {};

		result = [];
		$scope.autocomplete = function(term) {
			var name = undefined;
			var bu   = undefined;
			var reg  = undefined;
			var vat  = undefined;

			// Determine if it's name, bu, reg or vat number
			var num;
			if (num = parseInt(term)) {
				bu  = term.length < 8  ? num : undefined;
				vat = term.length == 8 ? num : undefined;
				reg = term.length > 8  ? num : undefined;
			} else {
				name = term;
			}

			console.log("bu: " + bu);
			console.log("kljucna beseda: " + name);
			console.log("maticna: " + reg);
			console.log("davcna: " + vat);

			apiService.getInstitutes(function (response) {
				result = response.data;
			}, {name: name, bu_code: bu, reg_number: reg, vat_number: vat});

			return result;
		};

		$scope.onSelect = function(id) {
			$scope.nodeId = id.bu_code.toString();
		}

		// Draw graph for given node
		$scope.findNode = function() {
			$location.path("/mainGraph/" + $scope.nodeId);
		}

	}
})