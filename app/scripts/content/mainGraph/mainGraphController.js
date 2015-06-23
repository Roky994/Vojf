define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
    return function($scope, $timeout, $routeParams, apiService) {

        var latCenter = 46.0499335;
        var lonCenter = 14.5067506;
        
        $scope.legend = [];
        
        var colors = ["#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF", 
                        "#800000","#008000","#000080", "#808000", "#800080", "#008080", "#808080", 
                         "#C00000", "#00C000", "#0000C0", "#C0C000","#00C0C0"];
        
        apiService.getCategories(function(data) {
            for(var i = 0; i < data.data.length; i++) {
                $scope.legend.push({category: data.data[i].name, color: colors[i]});
            }
            loadJson();
        });
        
        
        
        
        
                   
        // Graph directive settings
        // Search term
        
        if($routeParams.nodeId !== 'undefined') {
            $scope.nodeId = $routeParams.nodeId;
        }
        $scope.neighbours = [];
        $scope.graph = {nodes: [], edges: []};

        $scope.drawGraph = function() {};
        $scope.findNodeById = function() {};
        $scope.reset = function() {};
        $scope.showCategory = function(index){

        };
        // Find node by id
        $scope.findNode = function() {
            // Ignore border points
            if ($scope.nodeId !== 'undefined' && $scope.nodeId.charAt(0) !== "b")
                $scope.findNodeById($scope.nodeId);
        }

        $scope.settings = {
            // Basic
            graphName: "Lokacijski graf",
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
            zoomMin: 1/80
        };

        


        // Get data
        var loadJson = function() {

            $.getJSON('public/data/trans201403_samo_pu_koord_kategorije-popravljeno-2.json', function( data ){
                parseJsonForGraph(data);
            });

            $.getJSON('public/data/slovenia.geojson', function( data ) {
                parseJsonForBorder(data);
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

                $scope.graph.edges.push({
                    "id": key,
                    "source": value[0].source,
                    "target": value[0].target,
                    "label": transTotal,
                    "type": "arrow",
                    "color": "rgba(255,255,255,0)"
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

                var x = ((parseFloat(value.lon) - lonCenter)).toFixed(4);
                var y = -((parseFloat(value.lat) - latCenter)).toFixed(4);

                var distanceFromCenter = x*x + y*y;
                if(distanceFromCenter < 0.01) {
                    x *= 1.75;
                    y *= 1.75;
                }

                var node = {
                    "id": key,
                    "label": value.naziv,
                    "x": x,
                    "y": y,
                    "size": size,
                    "outcomeSum": 0,
                    "color": $scope.legend[value.category-1].color,
                    "category": value.category-1
                };

                $scope.graph.nodes.push(node);

            });

            $scope.drawGraph();

        }

        // Parse JSON from file - OLD
        var parseJsonForGraph = function(data) {
            // Graph
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

                $scope.graph.edges.push({
                    "id": key,
                    "source": value[0].source,
                    "target": value[0].target,
                    "label": transTotal,
                    "type": "arrow",
                    "color": "rgba(255,255,255,0)"
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

                var x = ((parseFloat(value.lon) - lonCenter)).toFixed(4);
                var y = -((parseFloat(value.lat) - latCenter)).toFixed(4);

                var distanceFromCenter = x*x + y*y;
                if(distanceFromCenter < 0.01) {
                    x *= 1.75;
                    y *= 1.75;
                } 
                
                    	 
                
                var node = {
                    "id": key,
                    "label": value.naziv,
                    "x": x,
                    "y": y,
                    "size": size,
                    "outcomeSum": 0,
                    "color": $scope.legend[value.category-1].color,
                    "category": value.category-1
                };

                $scope.graph.nodes.push(node);

            });

            $scope.drawGraph();

        }

        var parseJsonForBorder = function (data) {
            var t0 = performance.now();

            data = data.features[0].geometry.coordinates[0];

            for (var i in data) {
                var node = {
                    "id": "b" + i.toString(),
                    "x": ((parseFloat(data[i][0]) - lonCenter)).toFixed(4),
                    "y": -((parseFloat(data[i][1]) - latCenter)).toFixed(4),
                    "size": 0.1,
                    //"outcomeSum": 0,
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

            var t1 = performance.now();
           // console.log("Slovenia border loading took: " + (t1 - t0) + " milliseconds.");
        };

        // JSON
        
        
       

    }
})