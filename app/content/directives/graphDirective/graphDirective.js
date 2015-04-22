define([], function() {

	return function() {
		return {
			restrict: 'E',
			replace: true,
			template: '<div id="graph-container"></div>',
			scope: {
				settings: '=',
				graph: '=',
				drawgraph: '='
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

					sigma.prototype.zoomToNode = function(node, ratio){
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
						if(typeof camera == "undefined"){
					        camera = this.cameras[0];
					    }

					    s.graph.nodes().forEach(function(n) {
				          n.color = '#333';
				        });

				        s.graph.edges().forEach(function(e) {
				          e.color = '#222';
				        });
				        
				        s.refresh();

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
					console.log($scope.graph);
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
				
				}
				
			}
		}
	}

});