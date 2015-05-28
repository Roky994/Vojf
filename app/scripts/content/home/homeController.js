define(['sigma', 'jQuery'], function(sigma, $) {
    
	return function($scope, $http, $location) {
	    $scope.redirect = function(){

            // Geolocation, nearest node to user??!?
            if (typeof $scope.search === 'undefined') {
                console.log("Undefined search");
            }

	    	$location.path("/mainGraph/" + $scope.search);
	    }
	}
})