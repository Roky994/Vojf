define(['sigma', 'jQuery', 'sigma-gexf-parser'], function(sigma, $){
	return function($scope) {


		var testFunction = function() {
			$.getJSON('../public/data/out.json', function( data ){
				parseJsonForGraph( data );
			});
		}

		var parseJsonForGraph = function(data) {
			var g = {nodes: [], edges: []};
			
			$.each(data.nodes, function(key, value) {
				g.nodes.push({
					"id": key,
					"label": value.naziv,
					"color": "rgb(255,51,51)"
				});
			});

			$.each(data.edges, function(key, value) {
				g.edges.push({
					"id": key,
					"source": value[0].source,
					"target": value[0].target,
					"label": value[0].znesek
				})
			});

			drawGraph(g);
		}

		var drawGraph = function(g) {

			console.log(g);

			var s;
			
			s = new sigma({
			  graph: g,
			  renderer: {
			  	container: document.getElementById('graph-container'),
			  	type:'canvas'
			  },
			  settings: {
			  	sideMargin: 0.5,
			  	minNodeSize: 2,
			  	maxNodeSize: 10,
			  	doubleClickEnabled: false,

			  }
			});

			console.log(s);

		}
		//JSON
		testFunction();




	}
})