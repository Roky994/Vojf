define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
	return function($scope, $timeout, $routeParams, apiService) {

        //firt process url params
        $scope.processUrlParams();
        $scope.parseUrl();

        var institutes = [];
        var edges      = [];

	    $scope.legend = [];
        $scope.peddingQuery = true;

        $scope.neighbours = [];
        $scope.graph = {nodes: [], edges: []};

        $scope.drawGraph = function() {};
        $scope.findNodeById = function() {};
        $scope.reset        = function() {};
        $scope.showCategory = function() {};

        $scope.forceAtlas = true;

        $scope.autocomplete();

        $scope.onSelect = function(id) {
            $scope.nodeId = id.bu_code.toString();
        }

        // Draw graph for given node
        $scope.findNode = function() {
            $scope.findNodeById($scope.nodeId);
        }

        $scope.settings = {
            // Basic
            doubleClickEnabled: false,
            // Nodes
            minNodeSize: 1,
            maxNodeSize: 6,
           // defaultNodeColor: '#333',
            labelThreshold: 6,
            labelColor: "node",
            defaultHoverLabelBGColor: "rgba(255, 255, 255, 0)",
            // Edges
            minEdgeSize: 1,
            maxEdgeSize: 5,
            defaultEdgeColor: '#222',
            //
            zoomMin: 1/80
        }

        $scope.$watch("activeNode", function(){
            $scope.activeNodeChange();
        });

        $scope.activeNodeChange = function() {
            console.log($scope.activeNode);
            if ($scope.activeNode === undefined || $scope.activeNode === null) {
                $scope.acSelected = undefined;
                return;
            }

            if ($scope.activeNode.id.match(/^\d{1,2}$/)) {
                $scope.acSelected = undefined;
                return;
            }

            $scope.acSelected = $scope.activeNode.label;
            apiService.getCompany(function(obj) {
                $scope.activeNode.apiData = obj.data[0];
            }, {bu_code: $scope.activeNode.id});
        };

        // Find node by id
        $scope.findNode = function() {
            if ($scope.nodeId !== 'undefined')
                $scope.findNodeById($scope.nodeId);
        }

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
            // Graph
			var maxAmount = 0;

            angular.forEach(institutes, function(institute, key) {
                institute.totalExpenses = undefined;
                institute.isTarget = undefined;
            });

            angular.forEach(edges, function(edge, key) {

				//interiraj po vseh transakcijah med vozliscema in sestej zneske
				if(edge.amount > maxAmount) {
                    maxAmount = edge.amount;
                }

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

                sourceInstitute.lon = edge.source_lon;
                sourceInstitute.lat = edge.source_lat;
                targetInstitute.lon = edge.target_lon;
                targetInstitute.lat = edge.target_lat;
                targetInstitute.isTarget = true;

                $scope.graph.edges.push({
                    "id": key.toString(),
                    "source": edge.source_bu_code.toString(),
                    "target": edge.target_bu_code.toString(),
                    "label": edge.amount,
                    "type": "arrow",
                    "color": "#AAA"
                });
			});

            angular.forEach(institutes, function(institute, key) {

                if(institute.totalExpenses == undefined && institute.isTarget == undefined) {
                    return;
                }
                var size = 0.1;
                if(institute.totalExpenses > maxAmount / 1.1) {
                    size = 2;
                } else if(institute.totalExpenses > maxAmount / 1.5) {
                    size = 1.5;
                } else if (institute.totalExpenses > maxAmount / 2) {
                    size = 1.2;
                } else if (institute.totalExpenses > maxAmount / 3) {
                    size = 1;
                } else if (institute.totalExpenses > maxAmount / 5) {
                    size = 0.5;
                }

                var node = {
                    "id": institute.bu_code.toString(),
                    "label": institute.name,
                    "x": Math.random() * 1000,
                    "y": Math.random() * 1000,
                    "size": size,
                    "outcomeSum": 0,
                    "color": $scope.legend[institute.category - 1].color,
                    "category": institute.category - 1
                };

                $scope.graph.nodes.push(node);

            });

            $scope.peddingQuery = false;
            $scope.drawGraph();

            // Find node from URL parameter
            if ($scope.nodeId!== 'undefined') {
                $scope.findNodeById($scope.nodeId);
            }
        }

        loadCategories();

	}
})
