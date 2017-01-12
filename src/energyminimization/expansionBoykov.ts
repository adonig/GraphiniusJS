/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';
import * as $MC from '../mincutmaxflow/minCutMaxFlowBoykov';

type EnergyFunctionInteractionTerm = (arg1: string, arg2: string) => number;
type EnergyFunctionDataTerm = (arg1: string, ...args: any[]) => number;
type EnergyFunction = (...args: any[]) => number;


export interface EMEConfig {
	directed: boolean; // do we
  labeled: boolean;
  interactionTerm : EnergyFunctionInteractionTerm;
  dataTerm : EnergyFunctionDataTerm;
}


export interface EMEResult {
  graph : $G.IGraph;
}


export interface IEMEBoykov {
  calculateCycle() : EMEResult;
	constructGraph() : $G.IGraph;
	deepCopyGraph(graph : $G.IGraph) : $G.IGraph;
	initGraph(graph: $G.IGraph) : $G.IGraph;
  prepareEMEStandardConfig() : EMEConfig;
}


export interface EMEState {
	expansionGraph	: $G.IGraph;
  labeledGraph    : $G.IGraph;
  activeLabel     : string;
  energy          : number;
}



/**
 *
 */
class EMEBoykov implements IEMEBoykov {

  private _config : EMEConfig;
  private _state  : EMEState = {
		expansionGraph 	: null,
    labeledGraph    : null,
    activeLabel     : '',
    energy          : Infinity
  };
  private _interactionTerm : EnergyFunctionInteractionTerm;
  private _dataTerm : EnergyFunctionDataTerm;

  constructor( private _graph 	 : $G.IGraph,
               private _labels   : Array<string>,
						   config?           : EMEConfig )
  {
     this._config = config || this.prepareEMEStandardConfig();

		 // set the energery functions
     this._interactionTerm = this._config.interactionTerm;
     this._dataTerm = this._config.dataTerm;

		 // initialize graph => set labels
		 this._graph = this.initGraph(_graph);

		 // init state
		 this._state.labeledGraph = this.deepCopyGraph(this._graph);
		 this._state.activeLabel = this._labels[0];
  }


  calculateCycle() {
    var success : boolean = false;

		var mincut_options : $MC.MCMFConfig = {directed: this._config.directed};

    // for each label
    for (let i = 0; i < this._labels.length; i++) {
        this._state.activeLabel = this._labels[i];
        // find a new labeling f'=argminE(f') within one expansion move of f
        this._state.expansionGraph = this.constructGraph(); // construct new expansion graph

        var source : $N.IBaseNode = this._state.expansionGraph.getNodeById("SOURCE");
        var sink   : $N.IBaseNode = this._state.expansionGraph.getNodeById("SINK");

				// compute the min cut
        var MinCut : $MC.IMCMFBoykov;
        MinCut = new $MC.MCMFBoykov(this._state.expansionGraph, source, sink, mincut_options);
        var mincut_result: $MC.MCMFResult = MinCut.calculateCycle();

        if (mincut_result.cost < this._state.energy) {
            this._state.energy = mincut_result.cost;
            this._state.labeledGraph = this.labelGraph(mincut_result, source);
            success = true;
        }

    }

    if (success) {
      this.calculateCycle();
    }

    var result: EMEResult = {
			graph : this._state.labeledGraph
    }

    return result;
  }

  constructGraph() : $G.IGraph {
    /** TODO: perform a deep copy

        TODO: wait for bernd to implement a deep copy ;-)
    */
    var graph : $G.IGraph = this.deepCopyGraph(this._state.labeledGraph); // HACK!

		// copy node information
		var nodes: {[key: string] : $N.IBaseNode} = graph.getNodes();
		var node_ids: Array<string> = Object.keys(nodes);

    // add source (alpha) and sink (not alpha) to graph
    var source: $N.IBaseNode = graph.addNode("SOURCE");
    var sink: $N.IBaseNode = graph.addNode("SINK");

		// copy edge information now -> will cause infinite loop otherwise
		var edges: {[key: string] : $E.IBaseEdge} = graph.getUndEdges();
		var edges_length: number = Object.keys(edges).length;
		var edge_ids: Array<string> = Object.keys(edges);

		// for all nodes add
		// edge to source and edge to sink
		for (let i = 0; i < node_ids.length; i++) {
		    var node: $N.IBaseNode = nodes[node_ids[i]];

				var edge_options: $E.EdgeConstructorOptions = { directed: false, weighted: true, weight: 0};
				// add edge to source
				edge_options.weight = this._dataTerm(this._state.activeLabel, node.getID());
				var edge_source: $E.IBaseEdge = graph.addEdge(node.getID() + "_" + source.getID(), node, source, edge_options);

				// add edge to sink
				edge_options.weight = (node.getLabel() == this._state.activeLabel) ? Infinity : this._dataTerm(node.getLabel(), node.getID());
				var edge_sink: $E.IBaseEdge = graph.addEdge(node.getID() + "_" + sink.getID(), node, sink, edge_options);
		}

    // for all neighboring pixels {p, q} where label(p) != label(q) :
    // add auxiliary node a_{p_q}
		// add edge from auxiliary node to sink
    // add edges to auxiliary node (from p and q)
    // remove edge between p and q
    for (let i = 0; i < edges_length; i++) {
        // var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
				var edge: $E.IBaseEdge = edges[edge_ids[i]];
        var node_p: $N.IBaseNode = edge.getNodes().a;
        var node_q: $N.IBaseNode = edge.getNodes().b;

        // we don't care further for nodes of same labels
        if (node_p.getLabel() == node_q.getLabel()) {
          // just set the edge weight
          edge.setWeight(this._interactionTerm(node_p.getLabel(), this._state.activeLabel));
          continue;
        }

        // add auxiliary node
        var node_aux: $N.IBaseNode = graph.addNode("aux_" + node_p.getID() + "_" + node_q.getID());

        // add 3 edges [{p, aux}, {aux, q}, {aux, sink}]
				var edge_options: $E.EdgeConstructorOptions = { directed: false, weighted: true, weight: 0};
        // add edge {p, aux}
        edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
        var edge_p_aux: $E.IBaseEdge = graph.addEdge(node_p.getID() + "_" + node_aux.getID(), node_p, node_aux, edge_options);

        // add edge {aux, q}
        edge_options.weight = this._interactionTerm(this._state.activeLabel, node_q.getLabel());
        var edge_aux_q: $E.IBaseEdge = graph.addEdge(node_aux.getID() + "_" + node_q.getID(), node_aux, node_q, edge_options);

        // add edge {aux, sink}
        edge_options.weight = this._interactionTerm(node_p.getLabel(), node_q.getLabel());
        var edge_aux_sink: $E.IBaseEdge = graph.addEdge(node_aux.getID() + "_" + sink.getID(), node_aux, sink, edge_options);

        // remove the edge between p and q
        graph.deleteEdge(edge);
    }
    return graph;
  }

  // label a graph based on the result of a mincut
  labelGraph(mincut: $MC.MCMFResult, source: $N.IBaseNode) {
    var graph: $G.IGraph = this._state.labeledGraph;
		var source: $N.IBaseNode = this._state.expansionGraph.getNodeById("SOURCE");

    for (let i = 0; i < mincut.edges.length; i++) {
        var edge: $E.IBaseEdge = mincut.edges[i];

        var node_a: $N.IBaseNode = edge.getNodes().a;
        var node_b: $N.IBaseNode = edge.getNodes().b;
        if (node_a.getID() == source.getID()) {
						graph.getNodeById(node_b.getID()).setLabel(this._state.activeLabel);
            continue;
        }
        if (node_b.getID() == source.getID()) {
						graph.getNodeById(node_a.getID()).setLabel(this._state.activeLabel);
        }

    }

    return graph;
  }

  // deep copy a graph => only needed until there is a 'real' implementation in graphinius core
  // copy nodes and edges and the labels of the nodes
  // hack!
  deepCopyGraph(graph: $G.IGraph) {
    var cGraph: $G.IGraph = new $G.BaseGraph(graph._label + "_copy");

    // copy all nodes with their labels
    var nodes: {[key: string] : $N.IBaseNode} = graph.getNodes();
    for (let i = 0; i < Object.keys(nodes).length; i++) {
        var node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
        var cNode: $N.IBaseNode = cGraph.addNode(node.getID());
        cNode.setLabel(node.getLabel());
    }

    // copy all edges with their weights
    var edges: {[keys: string] : $E.IBaseEdge} = graph.getUndEdges();
    for (let i = 0; i < Object.keys(edges).length; i++) {
        var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
        var options: $E.EdgeConstructorOptions = { directed: false, weighted: true, weight: edge.getWeight()};
				var node_a: $N.IBaseNode = cGraph.getNodeById(edge.getNodes().a.getID());
				var node_b: $N.IBaseNode = cGraph.getNodeById(edge.getNodes().b.getID());
        var cEdge: $E.IBaseEdge = cGraph.addEdge(edge.getID(), node_a, node_b, options);
    }

    return cGraph;
  }

	initGraph(graph: $G.IGraph) {
		var nodes = graph.getNodes();
		for (let i = 0; i < Object.keys(nodes).length; i++) {
		    var node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
				node.setLabel(node.getFeature('label'));
		}
		return graph;
	}



  prepareEMEStandardConfig() : EMEConfig {
    // we use the potts model as standard interaction term
    var interactionTerm : EnergyFunctionInteractionTerm = function(label_a: string, label_b: string) {
      return (label_a == label_b) ? 0 : 1;
    };

    // squared difference of new label and observed label as standard data term
    // label: new label; node_id is needed to get the original(observed) label
    var dataTerm : EnergyFunctionDataTerm = function(label: string, node_id: string) {
      // get the label of the same node in the original graph
      var observed: string = this._graph.getNodeById(node_id).getLabel();

      var label_number: number = Number(label);
      var observed_number: number = Number(observed);

      if (isNaN(label_number) || isNaN(observed_number)) {
        throw new Error('Cannot convert labels to numbers!');
      }

      return 1.5*Math.pow(label_number - observed_number, 2);
    };

    return {
      directed: false,
      labeled: false,
      interactionTerm: interactionTerm,
      dataTerm: dataTerm
    }
  }

}


export {
  EMEBoykov
};
