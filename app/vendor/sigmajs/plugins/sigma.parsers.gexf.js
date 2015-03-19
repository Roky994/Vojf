;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');

  // Just a basic ID generator:
  var _id = 0;
  function edgeId() {
    return 'e' + (_id++);
  }

  /**
   * If the first arguments is a valid URL, this function loads a GEXF file and
   * creates a new sigma instance or updates the graph of a given instance. It
   * is possible to give a callback that will be executed at the end of the
   * process. And if the first argument is a DOM element, it will skip the
   * loading step and parse the given XML tree to fill the graph.
   *
   * @param  {string|DOMElement} target   The URL of the GEXF file or a valid
   *                                      GEXF tree.
   * @param  {object|sigma}      sig      A sigma configuration object or a
   *                                      sigma instance.
   * @param  {?function}         callback Eventually a callback to execute
   *                                      after having parsed the file. It will
   *                                      be called with the related sigma
   *                                      instance as parameter.
   */
  sigma.parsers.gexf = function(target, sig, callback) {
    var i,
        l,
        arr,
        obj;

    function parse(graph) {
      // Adapt the graph:
      console.log(graph);
      arr = graph.nodes;
      for (i = 0, l = arr.length; i < l; i++) {
        obj = arr[i];

        obj.id = obj.id;
        if (obj.viz && typeof obj.viz === 'object') {
          if (obj.viz.position && typeof obj.viz.position === 'object') {
            obj.x = obj.viz.position.x * 5;
            obj.y = obj.viz.position.y * 5;// Needed otherwise it's up side down
          } else {
            obj.x = Math.random() * 20;
            obj.y = Math.random() * 20;
          }
          obj.size = 1;
          obj.color = "#aaa";
        }
      }

      arr = graph.edges;
      for (i = 0, l = arr.length; i < l; i++) {
        obj = arr[i];

        obj.id = typeof obj.id === 'string' ? obj.id : edgeId();
        obj.source = '' + obj.source;
        obj.target = '' + obj.target;

        if (obj.viz && typeof obj.viz === 'object') {
          obj.color = obj.viz.color;
          obj.size = obj.viz.weight;
        } 

        // Weight over viz.thickness?
        //obj.size = obj.viz.weight;
      }

      // Update the instance's graph:
      if (sig instanceof sigma) {
        sig.graph.clear();

        arr = graph.nodes;
        for (i = 0, l = arr.length; i < l; i++)
          sig.graph.addNode(arr[i]);

        arr = graph.edges;
        for (i = 0, l = arr.length; i < l; i++)
          sig.graph.addEdge(arr[i]);

      // ...or instantiate sigma if needed:
      } else if (typeof sig === 'object') {
        sig.graph = graph;
        sig = new sigma(sig);

        
      // ...or it's finally the callback:
      } else if (typeof sig === 'function') {
        callback = sig;
        sig = null;
      }

      // Call the callback if specified:
      if (callback) {
        callback(sig || graph);
        return;
      } else
        return graph;
    }

    if (typeof target === 'string')
      gexf.fetch(target, parse);
    else if (typeof target === 'object')
      return parse(gexf.parse(target));
  };
}).call(this);
