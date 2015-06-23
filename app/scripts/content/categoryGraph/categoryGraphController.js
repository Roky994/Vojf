define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams, apiService) {

        var latCenter = 46.0556;
        var lonCenter = 14.5083;
		
		$scope.legend = [];
		
        var colors = ["#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF", 
                        "#800000","#008000","#000080", "#808000", "#800080", "#008080", "#808080", 
                         "#C00000", "#00C000", "#0000C0", "#C0C000","#00C0C0"];
        
        apiService.getCategories(function(data) {
            for(var i = 0; i < data.data.length; i++) {
                $scope.legend.push({category: data.data[i].name, color: colors[i]});
            }
            $scope.legend.push({category: "OSTALO", color: colors[17]});
            console.log($scope.legend);
            loadJson();
        });

		// Graph directive settings
        // Search term
		$scope.nodeId = $routeParams.nodeId;

		$scope.neighbours = [];
		$scope.graph = {nodes: [], edges: []};

		$scope.drawGraph = function() {};
		$scope.findNodeById = function() {};
		$scope.reset = function(){};

		$scope.forceAtlas = true;
		$scope.showCategory = function() {};

        // Find node by id
		$scope.findNode = function() {
            if ($scope.nodeId !== 'undefined')
                $scope.findNodeById($scope.nodeId);
		}

		$scope.settings = {
		  	// Basic
		  	doubleClickEnabled: false,

		  	// Nodes
		  	minNodeSize: 1,
	        maxNodeSize: 3,
	        //defaultNodeColor: '#333',
	        labelThreshold: 25,
	        labelColor: "node",
	        defaultHoverLabelBGColor: "rgba(255, 255, 255, 0)",
	        // Edges
	        minEdgeSize: 0.5,
	        maxEdgeSize: 2.5,
	        defaultEdgeColor: '#222',
	        zoomMin: 1/30
    	};

        // Get data
		var loadJson = function() {
			$.getJSON('public/data/trans201403_samo_pu_koord_kategorije.json', function( data ){
				parseJsonForGraph(data);
			});
		}

		var parseJsonForGraph = function(data) {

			var categorization =  new Array(18);
			for(var i = 0; i < 18; i++) {
				categorization[i] = new Array(18);
				for(var j = 0; j < 18; j++) 
					categorization[i][j] = 0;
			}

			$.each(data.edges, function(key, value) {

				// preveri ce nakazuje sam sebi!
				if(value[0].source == value[0].target){
					return;
				}

				var transTotal = 0;
				$.each(value, function(index, transacition) {
					transTotal += parseFloat(transacition.znesek);
				});

				value[0].total = transTotal;

				// zacetnemu vozliscu dodaj izplacani znesek
				if(data.nodes[value[0].source].totalExpenses == undefined) {
					data.nodes[value[0].source].totalExpenses = transTotal;
				} else {
					data.nodes[value[0].source].totalExpenses += transTotal;
				}

			});

			var minTotalExpenses = 500000;
			var minTransactionOnGraph = 1000;

			$.each(data.nodes, function(key,value) {

				if(value.totalExpenses != undefined && value.totalExpenses > minTotalExpenses) {
					value.edgesToCategories = new Array(18);
					for(var i = 0; i < 18; i++) 
						value.edgesToCategories[i] = {income: 0, outcome: 0};

				}

			});

			$.each(data.edges, function(key, value) {
				// preveri ce nakazuje sam sebi!
				if(value[0].source == value[0].target){
					return;
				}

				if(data.nodes[value[0].source].totalExpenses > minTotalExpenses && data.nodes[value[0].target].totalExpenses > minTotalExpenses) {
					//povezava med ustanovama

					$scope.graph.edges.push({
						"id": key,
						"source": value[0].source,
						"target": value[0].target,
						"label": value[0].total,
						"type": "curve",
						"arrow": "target",
						"color": "#AAA",
						"size": value[0].total / 100000000
					});

				} else if(data.nodes[value[0].source].totalExpenses > minTotalExpenses) {
					//samo source je ustanova target kategorija

					data.nodes[value[0].source].edgesToCategories[data.nodes[value[0].target].category - 1].outcome += value[0].total;

				} else if(data.nodes[value[0].target].totalExpenses > minTotalExpenses) {
					//samo source je ustanova target kategorija

					data.nodes[value[0].target].edgesToCategories[data.nodes[value[0].source].category - 1].income += value[0].total;
					
				} else {

					categorization[data.nodes[value[0].source].category - 1][data.nodes[value[0].target].category - 1] += value[0].total;

				}

			});

			$.each(data.nodes, function(key,value){

				if(value.totalExpenses != undefined && value.totalExpenses > minTotalExpenses) {

					$scope.graph.nodes.push({
		                "id": key,
		                "label": value.naziv,
		                "x": Math.random(),
		                "y": Math.random(),
		                "size": 1,
		                "color": $scope.legend[value.category-1].color
		        	});

		        	for(var i = 0; i < 18; i++) {
		        		if(value.edgesToCategories[i].outcome > minTransactionOnGraph) {
			        		$scope.graph.edges.push({
			        			"id": key + "-" + i,
								"source": key,
								"target": i + "",
								"label": value.edgesToCategories[i].outcome,
								"type": "curve",
								"arrow": "target",
								"color": "#AAA",
								"size": value.edgesToCategories[i].outcome / 100000000
			        		});
			        	}

			        	if(value.edgesToCategories[i].income > minTransactionOnGraph) {
			        		$scope.graph.edges.push({
			        			"id": i + "-" + key,
								"source": i + "",
								"target": key,
								"label": value.edgesToCategories[i].income,
								"type": "curve",
								"arrow": "target",
								"color": "#AAA",
								"size": value.edgesToCategories[i].income / 100000000
			        		});
			        	}

		        	}

				}

			});
		
			//kategorije in povezave med kategorijami
			for(var i = 0; i < 18; i++) {

				$scope.graph.nodes.push({
		                "id": i + "",
		                "label": $scope.legend[i].category,
		                "x": Math.random(),
		                "y": Math.random(),
		                "size": 1,
		                "color": $scope.legend[i].color
		        	});


				for(var j = 0; j < 18; j++) {

					if(categorization[i][j] < minTransactionOnGraph || i == j)
						continue;

					$scope.graph.edges.push({
						"id": i + "-" + j,
						"source": i + "",
						"target": j + "",
						"label": categorization[i][j],
						"type": "curve",
						"arrow": "source",
						"color": "#AAA"
					});

				}
			}


			$scope.drawGraph();
		}
  

	}
})