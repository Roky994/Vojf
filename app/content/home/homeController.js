define(['sigma', 'jQuery'], function(sigma, $) {
	return function($scope, $http, $location) {
		
		// Demonstrate all functionalities...
	    function demoBlink() {
	        $("button").fadeTo(800, 0.5).fadeTo(800, 1.0);
	    }
	    setInterval(function(){demoBlink()}, 1500);

	    $scope.redirect = function(){
	    	$location.path("/mainGraph/" + $scope.search);
	    }

	}
})