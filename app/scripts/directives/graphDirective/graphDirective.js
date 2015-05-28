define(['jQuery'], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/scripts/directives/graphDirective/graphDirectiveTemplate.html',
			scope: {
				settings: '=',
				graph: '=',
				drawgraph: '=',
				findnodebyid: '=',
				nodeid: '=',
				neighbours:'=',
				activenode:'=',
                forceatlas:'=',
				showcategory: '=',
				reset:'='
			},
			controller: function($scope, $timeout) {
				
				$scope.showcategory = function(categoryIndex) {
					console.log(categoryIndex);
		            s.graph.nodes().forEach(function(n, index) {
						if (n.id.charAt(0) == "b")
                        	return;
		
					  	if(categoryIndex == $scope.graph.nodes[index].category) {
							  n.color = $scope.graph.nodes[index].color;
						} else {
							n.color = "#EEE";
						}
			        });
					s.refresh();
		        }
					
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

					sigma.prototype.zoomToNode = function(node) {
		                camera = this.cameras[0];

					    sigma.misc.animation.camera(
						  camera, 
						  {
						    x: node[s.camera.readPrefix + 'x'], 
						    y: node[s.camera.readPrefix + 'y'],
						    ratio: $scope.settings.zoomMin * 15
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
						
						s.graph.nodes().forEach(function(n,i) {
				          n.color = $scope.graph.nodes[i].color;
				        });


				        s.graph.edges().forEach(function(e,i) {
				          e.color = $scope.graph.edges[i].color;
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
					
					$('#graph-overlay').css({
						top: 50,
						left: 15,
						width: $('#graph-container').width(),
						height: $('#graph-container').height()

					});


					s.bind('clickNode', function(e) {
						$scope.$apply(function() {
		                    $scope.findChoosedNode(e.data.node);
						});
					});

                    if ($scope.forceatlas) {
                        startForceatlas();
                    } else {
                    	$('#graph-overlay').hide();
                    }
				}

				// Find node by id
				$scope.findnodebyid = function(nodeId) {
					s.graph.nodes().forEach(function(node, i, a) {
		                if (node.id.localeCompare(nodeId) == 0) {
		                    $scope.findChoosedNode(node);
		                    return;
		                }
					});
				}

				// Get choosed node
				$scope.findChoosedNode = function(node) {

                    // Ignore border nodes
                    if (node.id.charAt(0) == "b")
                        return;

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
						else if (n.id.charAt(0) != "b")
							n.color = '#EEE';
					});
					$scope.neighbours = [];
					var j = 0;
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
							e.color = $scope.graph.edges[j].color;
						}
						j++;
					});

					s.zoomToNode(node, 0.05);
					s.refresh();
				}
				
				 // Reset the graph
				$scope.reset = function() {
					s.resetZoom();
					s.resetColors();
					$scope.nodeid = undefined;
					$scope.activenode = undefined;
				}

                var startForceatlas = function() {
                    s.startForceAtlas2({worker: true});

                    $timeout(function() {
                        s.stopForceAtlas2();
                      //  $scope.findNode();
                      
                      $('#graph-overlay').hide();
                    }, 1000);
                }
			}
		}
	}

});