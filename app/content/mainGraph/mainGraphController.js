define(['sigma', 'jQuery', 'forceAtlas'], function(sigma, $) {
	return function($scope, $timeout) {

		var testFunction = function() {
			$.getJSON('../public/data/trans201403_samo_pu.json', function( data ){
				parseJsonForGraph( data );
			});
		}

		var parseJsonForGraph = function(data) {

			var g = {nodes: [], edges: []};

			var maxTransTotal = 0;

			$.each(data.edges, function(key, value) {

				//interiraj po vseh transakcijah med vozliscema in sestej zneske
				var transTotal = 0;
				$.each(value, function(index, transacition) {
					transTotal += parseFloat(transacition.znesek);
				});

				if(transTotal < 50000) {
					return;
				}

				//shrani najvecji strosek za realizacijo velikosti vozlisc
				if( transTotal > maxTransTotal ) {
					maxTransTotal = transTotal;
				}

				//zacetnemu vozliscu dodaj izplacani znesek
				if(data.nodes[value[0].source].totalExpenses == undefined) {
					data.nodes[value[0].source].totalExpenses = transTotal;
				} else {
					data.nodes[value[0].source].totalExpenses += transTotal;
				}

				data.nodes[value[0].target].isTarget = true;

				g.edges.push({
					"id": key,
					"source": value[0].source,
					"target": value[0].target,
					"label": value[0].znesek
				});

			});

			$.each(data.nodes, function(key, value) {
				if(value.totalExpenses == undefined && value.isTarget == undefined) {
					return;
				}
				console.log(value.totalExpenses/ maxTransTotal);
				console.log(Math.ceil(value.totalExpenses/ maxTransTotal));

				g.nodes.push({
					"id": key,
					"label": value.naziv,
					"x": Math.random() * 1000,
					"y": Math.random() * 1000,
					"size": 1,
					"outcomeSum": 0
				});
			});

			

			drawGraph(g);
		}

		var drawGraph = function(g) {

			var s;
			
			s = new sigma({
			  graph: g,
			  renderer: {
			  	container: document.getElementById('graph-container'),
			  	type:'canvas'
			  },
			  settings: {
			  	sideMargin: 0.5,
			  	minNodeSize: 1,
		        maxNodeSize: 7,
		        minEdgeSize: 0.2,
		        maxEdgeSize: 0.5,
		       	defaultEdgeType: "curve",
			  	doubleClickEnabled: false,
			  	drawLabels: false
			  }
			});

			s.startForceAtlas2({worker: true});

			$timeout(function() {
				s.stopForceAtlas2();
			}, 1500);
		}

		//JSON
		testFunction();

	}
})