define(['sigma', 'jQuery', 'forceAtlas', 'customEdgesShapes'], function(sigma, $) {
    return function($scope, $timeout, $routeParams) {

        var latCenter = 46.0556;
        var lonCenter = 14.5083;

        // Graph directive settings
        // Search term
        $scope.nodeId = $routeParams.nodeId;

        $scope.neighbours = [];
        $scope.graph = {nodes: [], edges: []};

        $scope.drawGraph = function() {};
        $scope.findNodeById = function() {};

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
            zoomMin: 1/80
        };

        var colors = [];
        for (i=0; i < 18; i++) {
            colors.push(getRandomColor());
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

                //interiraj po vseh transakcijah med vozliscema in sestej zneske
                var transTotal = 0;
                $.each(value, function(index, transacition) {
                    transTotal += parseFloat(transacition.znesek);
                });

                if(transTotal < 150000) {
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

                var x = ((parseFloat(value.lon) - latCenter)*5).toFixed(4);
                var y = -((parseFloat(value.lat) - lonCenter)*5).toFixed(4);

                var node = {
                    "id": key,
                    "label": value.naziv,
                    "x": x,
                    "y": y,
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