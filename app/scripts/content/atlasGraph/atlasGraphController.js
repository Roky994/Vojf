define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams) {
		
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
        $scope.forceAtlas = true;

        $scope.settings = {
            // Basic
            doubleClickEnabled: false,

            // Nodes
            minNodeSize: 1,
            maxNodeSize: 10,
           // defaultNodeColor: '#333',
            labelThreshold: 8,
            labelColor: "node",
            defaultHoverLabelBGColor: "rgba(255, 255, 255, 0)",
            // Edges
            minEdgeSize: 1,
            maxEdgeSize: 5,
            defaultEdgeColor: '#222'
        }

        var colors = [];
        for (i=0; i < 18; i++) {
            colors.push(getRandomColor());
        }

        // Find node by id
        $scope.findNode = function() {
            if ($scope.nodeId !== 'undefined')
                $scope.findNodeById($scope.nodeId);
        }

        // Get data
		var loadJson = function() {
			$.getJSON('public/data/trans201403_samo_pu_koord_kategorije.json', function( data ){
				parseJsonForGraph(data);
			});
		}

        // Parse JSON
		var parseJsonForGraph = function(data) {
            // Graph
			var maxTransTotal = 0;

			$.each(data.edges, function(key, value) {

				//preveri ce nakazuje sam sebi!
				if(value[0].source == value[0].target){
					return;
				}

				//interiraj po vseh transakcijah med vozliscema in sestej zneske
				var transTotal = 0;

				$.each(value, function(index, transacition) {
					transTotal += parseFloat(transacition.znesek);
				});

				if(transTotal < 200000) {
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
				if(value[0].target == 27715) {
					console.log(transTotal);
				}

				data.nodes[value[0].target].isTarget = true;

                $scope.graph.edges.push({
					"id": key,
					"source": value[0].source,
					"target": value[0].target,
					"label": transTotal,
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

                var node = {
                    "id": key,
                    "label": value.naziv,
                    "x": Math.random() * 1000,
                    "y": Math.random() * 1000,
                    "size": size,
                    "outcomeSum": 0,
                    "color": colors[value.category-1]
                };

                $scope.graph.nodes.push(node);
			});

            $scope.drawGraph();

		}
		
		//JSON
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