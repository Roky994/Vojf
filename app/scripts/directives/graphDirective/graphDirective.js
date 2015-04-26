define([], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			template: '<div><button class="btn btn-default height45" ng-click="resetGraph()">Reset graph</button><div id="graph-container"></div></div>',
			scope: {
				settings: '=',
				graph: '=',
				drawgraph: '=',
				findnodebyid: '=',
				nodeid: '=',
				neighbours:'=',
				activenode:'=',
                forceatlas:'='
			},
			controller: function($scope, $timeout){
				
				$scope.drawgraph = function() {

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
		            } catch (err) {
		              //  console.log(err);
		            }

					sigma.prototype.zoomToNode = function(node, ratio) {
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
						if(typeof camera == "undefined") {
					        camera = this.cameras[0];
					    }

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

					sigma.prototype.resetColors = function() {

						var i = 0;
						s.graph.nodes().forEach(function(n) {
				          n.color = $scope.graph.nodes[i].color;
				          i++;
				        });

				        s.graph.edges().forEach(function(e) {
				          e.color = '#AAA';
				        });
				        
				        s.refresh();

					}

					s = new sigma({
						graph: $scope.graph,
						renderer: {
						  	container: $('#graph-container')[0],
						  	type: "canvas"
						},
						settings: $scope.settings
					});

					s.bind('clickNode', function(e) {
						$scope.$apply(function() {
		                    $scope.findChoosedNode(e.data.node);
						});
					});

                    if ($scope.forceatlas) {
                        startForceatlas();
                    }
				}

				// Find node by id
				$scope.findnodebyid = function(nodeId) {
					s.graph.nodes().forEach(function(node, i, a) {
		                if(node.id.localeCompare(nodeId) == 0) {
		                    $scope.findChoosedNode(node);
		                    return;
		                }
					});
				}

				// Get choosed node
				$scope.findChoosedNode = function(node) {
					$scope.nodeid = node.id;
					$scope.activenode = node;

                    // Neighoburs of searched node
					var toKeep = s.graph.neighbors(node.id);
					toKeep[node.id] = node;
					s.graph.nodes().forEach(function(n) {
						if(n.id == node.id){
							n.color = '#286090'
						}
						else if(toKeep[n.id]) {
                            n.color = '#888';
                        }
						else
							n.color = '#EEE';
					});
					$scope.neighbours = [];
					s.graph.edges().forEach(function(e) {
						if(toKeep[e.source] && (e.target.localeCompare(node.id) == 0)) {
							e.color = '#118811';
							toKeep[e.source].color = '#881111';
							$scope.neighbours.push({
								node: toKeep[e.source],
								edge: e,
								color: '#118811'
							});
						} else if (toKeep[e.target] && (e.source.localeCompare(node.id) == 0)) {
							e.color = '#881111';
							toKeep[e.target].color = '#118811';
							$scope.neighbours.push({
								node: toKeep[e.target],
								edge: e,
								color: '#881111'
							});
						} else {
							e.color = 'rgba(230,230,230,0.5)';
						}
					});

					s.zoomToNode(node, 0.05);
					s.refresh();
				}
				
				 // Reset the graph
				$scope.resetGraph = function() {
					s.resetZoom();
					s.resetColors();
					$scope.nodeid = "";
					$scope.activenode = undefined;
				}

                var startForceatlas = function() {
                    s.startForceAtlas2({worker: true});

                    $timeout(function() {
                        s.stopForceAtlas2();
                      //  $scope.findNode();
                    }, 1000);
                }
			}
		}
	}

});