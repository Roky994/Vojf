requirejs.config({
    paths: {
        'jQuery': 'vendor/jquery-1.11.2.min',
        'angular': 'vendor/angular/angular',
        'angular-route': 'vendor/angular-route/angular-route',
        'angular-ui-router': 'vendor/angular-ui-router/release/angular-ui-router',
        'angular-resource': 'vendor/angular-resource/angular-resource',
        'bootstrap': 'vendor/bootstrap.min',
        'sigma': 'vendor/sigmajs/sigma.min',
        'forceAtlas' : 'vendor/sigmajs/plugins/sigma.layout.forceAtlas2.min'
    },
    shim: {
        'angular': {
	      exports: 'angular',
	      deps: [ 'jQuery' ]
	    },
	    'angular-route': {
      	  deps: [ 'angular' ]
	    },
	    'angular-ui-router': {
	      deps: [ 'angular' ]
	    },
	    'angular-resource': {
	      deps: [ 'angular' ]
	    },
        'jQuery': {
	      exports: '$'
	    },
	    'bootstrap': {
	      deps: [ 'jQuery' ]
	    },
	    'sigma' : {
	    	exports: 'sigma'
	    },
	    'forceAtlas' : {
	    	deps: ['sigma']
	    }
    }
});

require( [
  'app'
], function ( App ) {
  App.initialize();
} );
