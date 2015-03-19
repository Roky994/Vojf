requirejs.config({
    paths: {
        'jQuery': 'vendor/jquery-1.11.2.min',
        'angular': 'vendor/angular/angular',
        'angular-route': 'vendor/angular-route/angular-route',
        'angular-ui-router': 'vendor/angular-ui-router/release/angular-ui-router',
        'angular-resource': 'vendor/angular-resource/angular-resource',
        'bootstrap': 'vendor/bootstrap.min',
        'sigma': 'vendor/sigmajs/sigma.min',
        'sigma-json-parser': 'vendor/sigmajs/plugins/sigma.parsers.json.min',
        'gexf-parser': 'vendor/sigmajs/plugins/gexf-parser',
        'sigma-gexf-parser': 'vendor/sigmajs/plugins/sigma.parsers.gexf'
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
	    'sigma-json-parser' : {
	    	deps: ['sigma'],
	    	exports: 'sigma.parsers.json'
	    },
	    'sigma-gexf-parser' : {
	    	deps: ['sigma', 'gexf-parser'],
	    	exports: 'sigma.parsers.gexf'
	    }
    }
});

require( [
  'app'
], function ( App ) {
  App.initialize();
} );
