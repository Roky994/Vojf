requirejs.config({
    paths: {
        'jQuery': 'vendor/jquery-1.11.2.min',
        'angular': 'vendor/angular/angular',
        'angular-route': 'vendor/angular-route/angular-route',
        'angular-ui-router': 'vendor/angular-ui-router/release/angular-ui-router',
        'angular-resource': 'vendor/angular-resource/angular-resource',
        'bootstrap': 'vendor/bootstrap.min',
        'sigma': 'vendor/sigmajs/sigma.min',
        'forceAtlas' : 'vendor/sigmajs/plugins/sigma.layout.forceAtlas2.min',
		    'customEdgesShapes' : 'vendor/sigmajs/plugins/sigma.renderers.customEdgeShapes.min',
        'lodash' : 'vendor/lodash.min',
		    'uiBootstrap' : 'vendor/ui-bootstrap-tpls-0.13.0.min',
        'toastr': 'vendor/toastr'
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
	    },
	    'customEdgesShapes' : {
	    	deps: ['sigma']
	    },
  		'uiBootstrap' : {
  			deps: ['angular']
  		}
    }
});

require( [
  'app',
  'bootstrap'
], function ( App ) {
  App.initialize();
} );
