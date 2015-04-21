define(['sigma', 'jQuery'], function(sigma, $) {
	return function($scope, $http, $location) {
	    $scope.redirect = function(){
	    	$location.path("/mainGraph/" + $scope.search);
	    }

	}
})