define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams) {

		var s;

        // Search term
		$scope.nodeId = $routeParams.nodeId;

		$scope.neighbours = [];

        // Find node by id
		$scope.findNode = function() {
            if ($scope.nodeId !== 'undefined')
                findNodeById();
		}

        // Get data
		var loadJson = function() {
			$.getJSON('public/data/trans201403_samo_pu.json', function( data ){
				parseJsonForGraph(data);
			});
		}

        // Parse JSON
		var parseJsonForGraph = function(data) {
            // Graph
			var g = {nodes: [], edges: []};
			var maxTransTotal = 0;

			$.each(data.edges, function(key, value) {

				//interiraj po vseh transakcijah med vozliscema in sestej zneske
				var transTotal = 0;
				$.each(value, function(index, transacition) {
					transTotal += parseFloat(transacition.znesek);
				});

				if(transTotal < 100000) {
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
				var size = 0.5;
				if(value.totalExpenses > maxTransTotal / 2) {
					size = 10;
				} else if( value.totalExpenses > maxTransTotal / 5) {
					size = 4;
				} else if ( value.totalExpenses > maxTransTotal / 30) {
					size = 3;
				} else if ( value.totalExpenses > maxTransTotal / 40) {
					size = 2;
				} else if (value.totalExpenses > maxTransTotal / 1000) {
					size = 1.5;
				} 
				g.nodes.push({
					"id": key,
					"label": value.naziv,
					"x": Math.random() * 1000,
					"y": Math.random() * 1000,
					"size": size,
					"outcomeSum": 0
				});
			});

			drawGraph(g);
		}

        // Draw the graph
		var drawGraph = function(g) {
            try {
                sigma.classes.graph.addMethod('neighbors', function (nodeId) {
                    var k,
                        neighbors = {},
                        index = this.allNeighborsIndex[nodeId] || {};

                    for (k in index) {
                        neighbors[k] = this.nodesIndex[k];
                    }

                    return neighbors;
                });
            } catch(err) { }

			sigma.prototype.zoomToNode = function(node, ratio){
                camera = this.cameras[0];

			    sigma.misc.animation.camera(
				  camera, 
				  {
				    x: node[s.camera.readPrefix + 'x'], 
				    y: node[s.camera.readPrefix + 'y'],
				    ratio: ratio
				  }, 
				  {duration: 1500}
				);
			}

			sigma.prototype.resetZoom = function() {
				if(typeof camera == "undefined"){
			        camera = this.cameras[0];
			    }

			    s.graph.nodes().forEach(function(n) {
		          n.color = '#333';
		        });

		        s.graph.edges().forEach(function(e) {
		          e.color = '#222';
		        });
		        
		        s.refresh();

				sigma.misc.animation.camera(
				  camera, 
				  {
				    x: 0,
				    y: 0,
				    ratio: 1
				  }, 
				  {duration: 1500}
				);
			}

			s = new sigma({
				graph: g,
				renderer: {
				  	container: $("#graph-container")[0],
				  	type: "canvas"
				},
				settings: {
				  	// Basic
				  	doubleClickEnabled: false,

				  	// Nodes
				  	minNodeSize: 1,
			        maxNodeSize: 10,
			        defaultNodeColor: '#333',
			        labelThreshold: 10,
			        labelColor: "node",
			        defaultHoverLabelBGColor: "rgba(255, 255, 255, 0)",
			        // Edges
			        minEdgeSize: 1,
			        maxEdgeSize: 5,
			        defaultEdgeColor: '#222'
		    	}
			});

			s.bind('clickNode', function(e) {
				$scope.$apply(function() {
                    $scope.findChoosedNode(e.data.node);
				});
			});

			// Beginning sort
			s.startForceAtlas2({worker: true});

			$timeout(function() {
				s.stopForceAtlas2();
				$scope.findNode();
			}, 1500);
		}

        // Get choosed node
		$scope.findChoosedNode = function(node) {
			setActiveNode(node);
			console.log(node.id);
			var toKeep = s.graph.neighbors(node.id);
			toKeep[node.id] = node;
			console.log(toKeep);
			s.graph.nodes().forEach(function(n) {
				if(toKeep[n.id])
					n.color = '#333';
				else
					n.color = '#AAA';
			});
			$scope.neighbours = [];
			s.graph.edges().forEach(function(e) {
				if(toKeep[e.source] && (e.target.localeCompare(node.id) == 0)){
					e.color = '#333';
					$scope.neighbours.push({
						node: toKeep[e.source],
						edge: e
					})
				} else if (toKeep[e.target] && (e.source.localeCompare(node.id) == 0)) {
					e.color = '#333';
					$scope.neighbours.push({
						node: toKeep[e.target],
						edge: e
					});
				} else {
					e.color = '#AAA';
				}
			});

			s.zoomToNode(node, 0.15);
			s.refresh();
		}

        // Find node by id
		var findNodeById = function() {
			s.graph.nodes().forEach(function(node, i, a) {
                if(node.id.localeCompare($scope.nodeId) == 0) {
                    $scope.findChoosedNode(node);
                    return;
                }
			});
		}

        // Selected node
		var setActiveNode = function (node) {
			$scope.activeNode = node;
			$scope.nodeId = node.id;
		}
		
		//JSON
		loadJson();
	}
})