define(['sigma', 'jQuery','lodash', 'forceAtlas', 'customEdgesShapes'], function(sigma, $, _) {
    return function($scope, $timeout, $routeParams, apiService) {

        $scope.drawGraph    = function() {};
        $scope.findNodeById = function() {};
        $scope.reset        = function() {};
        $scope.showCategory = function() {};

        var latCenter = 46.0499335;
        var lonCenter = 14.5067506;

        $scope.nodeId = $routeParams.nodeId.toString();

        $scope.legend = [];

        $scope.peddingQuery = true;
        apiService.getCategories(function(response) {
            $scope.legend = _.map(response.data, function(obj) {
                obj.color = "#" + obj.color;
                return obj;
            })

            loadInstitutes();
        });

        $scope.filter = {
            month: {},
            year: undefined,
            amount: {},
        }

        $scope.neighbours = [];
        $scope.graph = {nodes: [], edges: []};

        // Autocomplete
        result = [];
        $scope.autocomplete = function(term) {
            var name = undefined;
            var bu   = undefined;
            var reg  = undefined;
            var vat  = undefined;

            // Determine if it's name, bu, reg or vat number
            var num;
            if (num = parseInt(term)) {
                bu  = term.length < 8  ? num : undefined;
                vat = term.length == 8 ? num : undefined;
                reg = term.length > 8  ? num : undefined;
            } else {
                name = term;
            }

            console.log("bu: " + bu);
            console.log("kljucna beseda: " + name);
            console.log("maticna: " + reg);
            console.log("davcna: " + vat);

            apiService.getInstitutes(function (response) {
                result = response.data;
            }, {name: name, bu_code: bu, reg_number: reg, vat_number: vat});

            return result;
        };

        $scope.onSelect = function(id) {
            $scope.nodeId = id.bu_code.toString();
        }

        // Draw graph for given node
        $scope.findNode = function() {
            $scope.findNodeById($scope.nodeId);
        }

        // Graph directive settings
        $scope.settings = {
            // Basic
            graphName: "Lokacijski graf",
            doubleClickEnabled: false,
            // Nodes
            minNodeSize: 1,
            maxNodeSize: 2.5,
            //defaultNodeColor: '#333',
            labelThreshold: 25,
            labelColor: "node",
            defaultHoverLabelBGColor: "rgba(255, 255, 255, 0)",
            // Edges
            minEdgeSize: 1,
            maxEdgeSize: 5,
            defaultEdgeColor: '#222',
            zoomMin: 1/80
        };

        var institutes = [];
        var edges      = [];

        /*
        $scope.loadEdges = function() {
            loadEdges();
        }*/

        var loadEdges = function() {
            $scope.peddingQuery = true;
            $scope.graph = {nodes: [], edges: []};
            // Slovenia border
            loadBorder();
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

        // Get data for border
        var loadBorder = function() {
            $.getJSON('public/data/slovenia.geojson', function(data) {
                parseJsonForBorder(data);
            });
        }

//        // Parse JSON
//        var parseJsonForGraph = function(data) {
//            // Graph
//            var maxTransTotal = 0;
//            
//            
//
//            $.each(data.edges, function(key, value) {
//
//                //interiraj po vseh transakcijah med vozliscema in sestej zneske
//                var transTotal = 0;
//                $.each(value, function(index, transacition) {
//                    transTotal += parseFloat(transacition.znesek);
//                });
//
//                if(transTotal < 50000) {
//                    return;
//                }
//
//                //shrani najvecji strosek za realizacijo velikosti vozlisc
//                if( transTotal > maxTransTotal ) {
//                    maxTransTotal = transTotal;
//                }
//
//                //zacetnemu vozliscu dodaj izplacani znesek
//                if(data.nodes[value[0].source].totalExpenses == undefined) {
//                    data.nodes[value[0].source].totalExpenses = transTotal;
//                } else {
//                    data.nodes[value[0].source].totalExpenses += transTotal;
//                }
//
//                data.nodes[value[0].target].isTarget = true;
//
//                $scope.graph.edges.push({
//                    "id": key,
//                    "source": value[0].source,
//                    "target": value[0].target,
//                    "label": transTotal,
//                    "type": "arrow",
//                    "color": "rgba(255,255,255,0)"
//                });
//
//            });
//
//            $.each(data.nodes, function(key, value) {
//                if(value.totalExpenses == undefined && value.isTarget == undefined) {
//                    return;
//                }
//                var size = 0.1;
//                if(value.totalExpenses > maxTransTotal / 2) {
//                    size = 2;
//                } else if( value.totalExpenses > maxTransTotal / 5) {
//                    size = 1.5;
//                } else if ( value.totalExpenses > maxTransTotal / 30) {
//                    size = 1.2;
//                } else if ( value.totalExpenses > maxTransTotal / 40) {
//                    size = 1;
//                } else if (value.totalExpenses > maxTransTotal / 1000) {
//                    size = 0.5;
//                }
//
//                if(value.lon == 0) {
//                    value.lon = 15;
//                    value.lat = 46;
//                }
//
//                var x = ((parseFloat(value.lon) - lonCenter)).toFixed(4);
//                var y = -((parseFloat(value.lat) - latCenter)).toFixed(4);
//
//                var distanceFromCenter = x*x + y*y;
//                if(distanceFromCenter < 0.01) {
//                    x *= 1.75;
//                    y *= 1.75;
//                }
//
//                var node = {
//                    "id": key,
//                    "label": value.naziv,
//                    "x": x,
//                    "y": y,
//                    "size": size,
//                    "outcomeSum": 0,
//                    "color": $scope.legend[value.category-1].color,
//                    "category": value.category-1
//                };
//
//                $scope.graph.nodes.push(node);
//
//            });
//
//            $scope.drawGraph();
//
//

        var parseDataForGraph = function() {

            var maxAmount = 0;
            
            angular.forEach(institutes, function(institute, key) {
                institute.totalExpenses = undefined;
                institute.isTarget = undefined;
            });

            angular.forEach(edges, function(edge, key) {

                //shrani najvecji strosek za realizacijo velikosti vozlisc
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
                    "color": "rgba(255,255,255,0)"
                });

            });

            angular.forEach(institutes, function(institute, key) {

                if(institute.totalExpenses == undefined && institute.isTarget == undefined) {
                    return;
                }
                var size = 0.1;
                if(institute.totalExpenses > maxAmount / 1.2) {
                    size = 2;
                } else if(institute.totalExpenses > maxAmount / 1.8) {
                    size = 1.5;
                } else if (institute.totalExpenses > maxAmount / 3) {
                    size = 1.2;
                } else if (institute.totalExpenses > maxAmount / 5) {
                    size = 1;
                } else if (institute.totalExpenses > maxAmount / 10) {
                    size = 0.5;
                }

                var x = institute.lon.toFixed(4);
                var y = -institute.lat.toFixed(4);

                var distanceFromCenter = x*x + y*y;
                if(distanceFromCenter < 0.05) {
                    x *= 1.75;
                    y *= 1.75;
                }

                var node = {
                    "id": institute.bu_code.toString(),
                    "label": institute.name,
                    "x": x,
                    "y": y,
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
                console.log($scope.nodeId);
                $scope.findNodeById($scope.nodeId);
            }
        }

        var parseJsonForBorder = function (data) {

            data = data.features[0].geometry.coordinates[0];

            for (var i in data) {
                var node = {
                    "id": "b" + i.toString(),
                    "x": ((parseFloat(data[i][0]) - lonCenter)).toFixed(4),
                    "y": -((parseFloat(data[i][1]) - latCenter)).toFixed(4),
                    "size": 0.1,
                    "color": '#333'
                };

                $scope.graph.nodes.push(node);
            }

            for (var j = 0; j < data.length - 1; j++) {
                $scope.graph.edges.push({
                    "id": "be" + j,
                    "source": ("b" + j).toString(),
                    "target": ("b" + (j + 1)).toString(),
                    "size": 0.3,
                    "color": "#333"
                });

            }

        };

    }
});