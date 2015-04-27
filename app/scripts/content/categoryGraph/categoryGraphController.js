define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams) {

        var latCenter = 46.0556;
        var lonCenter = 14.5083;

        var categories = ["RS", "VLADA", "PROMET", "MINISTRSTVO", "IZOBRAŽEVANJE", "ZDRAVSTVO",
        					"SOCIALNE ZADEVE", "KULTURA", "GOSPODARSTVO", "RAZVOJ IN TEHNOLOGIJA",
        					"KMETIJSTVO IN GOSPODARSTVO", "PRAVOSODJE", "LOKALNA SAMOUPRAVA", 
        					"ŠPORT", "TURIZEM", "ZAŠČITA IN VAROVANJE", "INFRASTRUKTURA", "NULL"];

       	var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", 
        "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080", 
        "#C00000", "#00C000", "#0000C0", "#C0C000", "#C000C0", "#00C0C0", "#C0C0C0"];


		// Graph directive settings
        // Search term
		$scope.nodeId = $routeParams.nodeId;

		$scope.neighbours = [];
		$scope.graph = {nodes: [], edges: []};

		$scope.drawGraph = function() {};
		$scope.findNodeById = function() {};


		$scope.forceAtlas = true;

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
	        minEdgeSize: 1,
	        maxEdgeSize: 5,
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

			var minTotalExpenses = 1000000;
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
						"color": "#AAA"
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
		                "color": colors[value.category-1]
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
								"color": "#AAA"
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
								"color": "#AAA"
			        		});
			        	}

		        	}

				}

			});
			
		
			//kategorije in povezave med kategorijami
			for(var i = 0; i < 18; i++) {

				$scope.graph.nodes.push({
		                "id": i + "",
		                "label": categories[i],
		                "x": Math.random(),
		                "y": Math.random(),
		                "size": 1,
		                "color": colors[i]
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

   
		loadJson();



        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

	}
})