define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams) {
		var s;
        // Search term
		$scope.nodeId = $routeParams.nodeId;

		$scope.neighbours = [];

		$scope.graph = {nodes: [], edges: []};

		$scope.drawGraph = function() {}

        // Find node by id
		$scope.findNode = function() {
            if ($scope.nodeId !== 'undefined')
                findNodeById();
		}

        // Reset the graph
		$scope.resetGraph = function() {
			s.resetZoom();
		}

        // Get data
		var loadJson = function() {
			$.getJSON('public/data/trans201403_samo_pu_koord.json', function( data ){
				parseJsonForGraph(data);
			});
		}

        // Parse JSON
		var parseJsonForGraph = function(data) {
            // Graph
		
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

				$scope.graph.edges.push({
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
				var size = 0.1;
				if(value.totalExpenses > maxTransTotal / 2) {
					size = 2;
				} else if( value.totalExpenses > maxTransTotal / 5) {
					size = 1.5;
				} else if ( value.totalExpenses > maxTransTotal / 30) {
					size = 1.2;
				} else if ( value.totalExpenses > maxTransTotal / 40) {
					size = 1;
				} else if (value.totalExpenses > maxTransTotal / 1000) {
					size = 0.5;
				}

				if(value.lon == 0) {
					value.lon = 15;
					value.lat = 46;
				}

				var x = ((parseFloat(value.lon) - 15)*5).toFixed(4);
				var y = -((parseFloat(value.lat) - 46)*5).toFixed(4);

				$scope.graph.nodes.push({
					"id": key,
					"label": value.naziv,
					"x": x,
					"y": y,
					"size": size,
					"outcomeSum": 0
				});
				
			});

			$scope.drawGraph();
		}

		$scope.settings = {
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
    	};


        
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