define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams, apiService) {
		
		//firt process url params
        $scope.processUrlParams();
        $scope.parseUrl();
		
		var institutes = [];
        var edges      = [];
		$scope.legend  = [];
        $scope.peddingQuery = true;
		// Graph directive settings
        // Search term
		$scope.nodeId = $routeParams.nodeId;

		$scope.neighbours = [];
		$scope.graph = {nodes: [], edges: []};

		$scope.drawGraph = function() {};
        $scope.findNodeById = function() {};
        $scope.reset        = function() {};
        $scope.showCategory = function() {};

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
	        minEdgeSize: 0.5,
	        maxEdgeSize: 2.5,
	        defaultEdgeColor: '#222',
	        zoomMin: 1/30
    	};
		
		//for query function call
        $scope.loadEdges = function() {
            loadEdges();
        }
        
        var loadEdges = function() {
            //update url
            $scope.setUrlParams();
            
            $scope.peddingQuery = true;
            $scope.graph = {nodes: [], edges: []};

            // Get graph from API
            apiService.getGraph(function(response) {
                edges = response.data;
                // Draw graph
                parseDataForGraph();
            }, $scope.filter);
        }

        var loadInstitutes = function() {
            apiService.getInstitutes(function(response) {
                institutes = response.data;
                loadEdges();
            }, {name: {}});
        }
        
        var loadCategories = function() {
            apiService.getCategories(function(response) {
                $scope.legend = _.map(response.data, function(obj) {
                    obj.color = "#" + obj.color;
                    return obj;
                })
                loadInstitutes();
            });
        }
		
		var parseDataForGraph = function() {
			
			var categorization =  new Array(18);
			for(var i = 0; i < 18; i++) {
				categorization[i] = new Array(18);
				for(var j = 0; j < 18; j++) 
					categorization[i][j] = 0;
			}
			
			angular.forEach(institutes, function(institute, key) {
                institute.totalExpenses = undefined;
            });
			
			angular.forEach(edges, function(edge, key) {

				// zacetnemu vozliscu dodaj izplacani znesek
				var sourceInstitute, targetInstitute;
                for (var i=0; i < institutes.length; i++) {
                    if (institutes[i].bu_code == edge.source_bu_code) {
                        sourceInstitute = institutes[i];
                    }

                    if (institutes[i].bu_code == edge.target_bu_code) {
                        targetInstitute = institutes[i];
                    }

                    if (sourceInstitute && targetInstitute)
                        break;
                }
				
				//zacetnemu vozliscu dodaj izplacani znesek
                if(sourceInstitute.totalExpenses == undefined) {
                    sourceInstitute.totalExpenses = edge.amount;
                } else {
                    sourceInstitute.totalExpenses += edge.amount;
                }
				
			});
			
			var minTotalExpenses = 500000;
			var minTransactionOnGraph = 1;
			
			angular.forEach(institutes, function(institute, key) {
				
				if(institute.totalExpenses != undefined && institute.totalExpenses > minTotalExpenses) {
					institute.edgesToCategories = new Array(18);
					for(var i = 0; i < 18; i++) 
						institute.edgesToCategories[i] = {income: 0, outcome: 0};

				}

				
			});
			
			angular.forEach(edges, function(edge, key) {
				
				// zacetnemu vozliscu dodaj izplacani znesek
				var sourceInstitute, targetInstitute;
                for (var i=0; i < institutes.length; i++) {
                    if (institutes[i].bu_code == edge.source_bu_code) {
                        sourceInstitute = institutes[i];
                    }

                    if (institutes[i].bu_code == edge.target_bu_code) {
                        targetInstitute = institutes[i];
                    }

                    if (sourceInstitute && targetInstitute)
                        break;
                }
				
				if(sourceInstitute.totalExpenses > minTotalExpenses && targetInstitute.totalExpenses > minTotalExpenses) {
					//povezava med ustanovama

					$scope.graph.edges.push({
						"id": key + "",
						"source": edge.source_bu_code.toString(),
						"target": edge.target_bu_code.toString(),
						"label": edge.amount,
						"type": "curve",
						"arrow": "target",
						"color": "#AAA",
						"size": edge.amount / 100000000
					});

				} else if(sourceInstitute.totalExpenses > minTotalExpenses) {
					//samo source je ustanova target kategorija

					sourceInstitute.edgesToCategories[sourceInstitute.category - 1].outcome += edge.amount;

				} else if(targetInstitute.totalExpenses > minTotalExpenses) {
					//samo source je ustanova target kategorija

					targetInstitute.edgesToCategories[sourceInstitute.category - 1].income += edge.amount;
					
				} else {

					categorization[sourceInstitute.category - 1][targetInstitute.category - 1] += edge.amount;

				}
				
			});
			
			angular.forEach(institutes, function(institute, key) {
				
				if(institute.totalExpenses != undefined && institute.totalExpenses > minTotalExpenses) {

					$scope.graph.nodes.push({
		                "id": institute.bu_code.toString(),
		                "label": institute.name,
		                "x": Math.random(),
		                "y": Math.random(),
		                "size": 1,
		                "color": $scope.legend[institute.category-1].color
		        	});

		        	angular.forEach($scope.legend, function(category, i){
						
						if(institute.edgesToCategories[i].outcome > minTransactionOnGraph) {
			        		$scope.graph.edges.push({
			        			"id": key + "-" + i,
								"source": institute.bu_code.toString(),
								"target": i + "",
								"label": institute.edgesToCategories[i].outcome,
								"type": "curve",
								"arrow": "target",
								"color": "#AAA",
								"size": institute.edgesToCategories[i].outcome / 100000000
			        		});
			        	}

			        	if(institute.edgesToCategories[i].income > minTransactionOnGraph) {
			        		$scope.graph.edges.push({
			        			"id": i + "-" + key,
								"source": i + "",
								"target": institute.bu_code.toString(),
								"label": institute.edgesToCategories[i].income,
								"type": "curve",
								"arrow": "target",
								"color": "#AAA",
								"size": institute.edgesToCategories[i].income / 100000000
			        		});
			        	}
					});

				}
				
			});
			
			//kategorije in povezave med kategorijami
		    angular.forEach($scope.legend, function(category, i){

				$scope.graph.nodes.push({
		                "id": i + "",
		                "label": category.name,
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
			});
		
			console.log($scope.graph);
			$scope.peddingQuery = false;
			$scope.drawGraph();

			
		}
  		
		loadCategories();

	}
})