define(['sigma', 'jQuery', 'sigma-gexf-parser'], function(sigma, $) {
	return function($scope, $http) {
		
		// Demonstrate all functionalities...
	    function demoBlink() {
	        $("button").fadeTo(800, 0.5).fadeTo(800, 1.0);
	    }
	    
	    setInterval(function(){demoBlink()}, 1500);
	

	}
})