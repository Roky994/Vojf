define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout) {

		sigma.classes.graph.addMethod('neighbors',  function(nodeId) {

					var k,
						neighbors = {},
						index = this.allNeighborsIndex[nodeId] || {};
					console.log(index);
					for(k in index) {
						neighbors[k] = this.nodesIndex[k];
					}

					return neighbors;

				});

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
					"label": value[0].znesek,
					"type": "arrow"
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

			sigma.prototype.zoomToNode = function(node, ratio){
			    if(typeof camera == "undefined"){
			        camera = this.cameras[0];
			    }

			    sigma.misc.animation.camera(
				  camera, 
				  {
				    x: node[s.camera.readPrefix + 'x'], 
				    y: node[s.camera.readPrefix + 'y'],
				    ratio: ratio
				  }, 
				  {duration: s.settings('animationsTime') || 500}
				);
			}


			sigma.prototype.resetZoom = function() {
				if(typeof camera == "undefined"){
			        camera = this.cameras[0];
			    }
				sigma.misc.animation.camera(
				  camera, 
				  {
				    x: 0,
				    y: 0,
				    ratio: 1
				  }, 
				  {duration: s.settings('animationsTime') || 500}
				);
			}

			$scope.resetGraph = function() {
				s.resetZoom();
			}

			var s;
			
			s = new sigma({
				graph: g,
				renderer: {
				  	container: document.getElementById('graph-container'),
				  	type: "canvas"
				},
				settings: {
				  	//basic
				  	doubleClickEnabled: false,

				  	//nodes
				  	minNodeSize: 1,
			        maxNodeSize: 5,
			        drawLabels: false,
			        defaultNodeColor: '#333',

			        //edges
			        minEdgeSize: 1,
			        maxEdgeSize: 5,
			        defaultEdgeColor: '#222',
		    	}
			});

			s.bind('clickNode', function(e) {
				var nodeId = e.data.node.id,
					toKeep = s.graph.neighbors(nodeId);
				toKeep[nodeId] = e.data.node;

				s.graph.nodes().forEach(function(n) {
					if(toKeep[n.id])
						n.color = '#333';
					else
						n.color = '#555';
				});

				s.graph.edges().forEach(function(e) {
					if((toKeep[e.source] && (e.target.localeCompare(nodeId) == 0))  || (toKeep[e.target] && (e.source.localeCompare(nodeId) == 0))) {
						e.color = '#333';
					} else {
						e.color = '#555';
					}
				});

				s.zoomToNode(e.data.node, 0.2);
				s.refresh();

			});

			s.bind('clickStage', function(e) {

				s.graph.nodes().forEach(function(n) {
		          n.color = '#333';
		        });

		        s.graph.edges().forEach(function(e) {
		          e.color = '#222';
		        });

		        s.refresh();
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