import * as Edges from "./Edges";


interface IBaseNode {
	// Public properties
	_id					: number;
	_label			: string;
	
	// UNTYPED feature methods
	getUntypedFeatures() : { [k:string] : any };
	// getFeature
	
	// Degrees
	inDegree() : number;
	outDegree() : number;
	degree() : number;
	
	// EDGE methods
	addEdge(edge: Edges.IBaseEdge) : void;
	hasEdge(edge: Edges.IBaseEdge) : boolean;	
	hasEdgeID(id: number) : boolean;
	
	getEdge(id: number) : Edges.IBaseEdge;
	
	inEdges() : {[k: number] : Edges.IBaseEdge};
	outEdges() : {[k: number] : Edges.IBaseEdge};
	undEdges() : {[k: number] : Edges.IBaseEdge};
	
	removeEdge(edge: Edges.IBaseEdge) : void;
	removeEdgeID(id: number) : Edges.IBaseEdge;
	
	// Do we need this? contemplating...
	// Just for test cases it seems...
	clearEdges() : void;
	
	// connected NODES methods
	prevNodes() : Array<IBaseNode>;
	nextNodes() : Array<IBaseNode>;
	connNodes() : Array<IBaseNode>;
}

interface NodeConstructorOptions {
	
}


class BaseNode implements IBaseNode {
	protected _untyped_features	: { [k:string] : any };
		
	/**
	 * Design decision:
	 * Do we only use ONE _edges hash - OR -
	 * separate hashes for _in_edges, _out_edges, _und_edges
	 * As getting edges based on their type during the
	 * execution of graph algorithms is pretty common,
	 * it's logical to separate the structures.
	 */
	protected _in_edges		: {[k: number] : Edges.IBaseEdge};
	protected _out_edges	: {[k: number] : Edges.IBaseEdge};
	protected _und_edges	: {[k: number] : Edges.IBaseEdge};
	
	
	constructor (public _id, public _label,
							untyped_features?: { [k:string] : any },
							options?: NodeConstructorOptions) 
	{
		this._in_edges = {};
		this._out_edges = {};
		this._und_edges = {};
		this._untyped_features = untyped_features || {};
		options = options || {};
		// now handle options...
	}
	
	getUntypedFeatures() : { [k:string] : any } {
		return this._untyped_features;
	}
	
	inDegree() : number {
		return Object.keys(this._in_edges).length;
	}
	
	outDegree() : number {
		return Object.keys(this._out_edges).length;
	}
	
	degree() : number {
		return Object.keys(this._und_edges).length;
	}
	
	/**
	 * We have to: 
	 * 1. throw an error if the edge is already attached
	 * 2. add it to the edge array
	 * 3. check type of edge (directed / undirected)
	 * 4. update our degrees accordingly
	 * This is a design decision we can defend by pointing out
	 * that querying degrees will occur much more often
	 * than modifying the edge structure of a node (??)
	 * One further point: do we also check for duplicate
	 * edges not in the sense of duplicate ID's but duplicate
	 * structure (nodes, direction) ?
	 * => Not for now, as we would have to check every edge
	 * instead of simply checking the hash id...
	 * ALTHOUGH: adding edges will (presumably) not occur often...
	 */
	addEdge(edge: Edges.IBaseEdge) : void {
		// is this edge connected to us at all?
		var nodes = edge.getNodes();
		if ( nodes.a !== this && nodes.b !== this ) {
			throw new Error("Cannot add edge that does not connect to this node");
		}
		
		// Edge with duplicate ID already present?
		if ( this._in_edges[ edge._id ] || this._out_edges[ edge._id ] || this._und_edges[ edge._id ]) {
			throw new Error("Cannot add same edge multiple times.");			
		}
		
		// Is it an undirected or directed edge?
		if ( edge.isDirected() ) {
			// is it outgoing or incoming?
			if ( edge.getNodes().a === this ) {
				this._out_edges[edge._id] = edge;
			}
			else {
				this._in_edges[edge._id] = edge;
			}
		}
		else {
			this._und_edges[edge._id] = edge;
		}
	}	
	
	hasEdge(edge: Edges.IBaseEdge) : boolean {
		return !!this._in_edges[ edge._id ] || !!this._out_edges[ edge._id ] || !!this._und_edges[ edge._id ];
	}
	
	hasEdgeID(id: number) : boolean {
		return !!this._in_edges[ id ] || !!this._out_edges[ id ] || !!this._und_edges[ id ];
	}
	
	getEdge(id: number) : Edges.IBaseEdge {
		var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("Cannot retrieve non-existing edge.");
		}
		return edge;
	}
	
	inEdges() : {[k: number] : Edges.IBaseEdge} {
		return this._in_edges;
	}
	
	outEdges() : {[k: number] : Edges.IBaseEdge} {
		return this._out_edges;
	}
	
	undEdges() : {[k: number] : Edges.IBaseEdge} {
		return this._und_edges;
	}
	
	removeEdge(edge: Edges.IBaseEdge) : void {
		if ( !this.hasEdge(edge) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		if ( this._und_edges[edge._id] ) { 
			delete this._und_edges[edge._id];
		}
		if ( this._in_edges[edge._id] ) { 
			delete this._in_edges[edge._id];
		}
		if ( this._out_edges[edge._id] ) { 
			delete this._out_edges[edge._id]; 
		}
	}
	
	removeEdgeID(id: number) : Edges.IBaseEdge {
		if ( !this.hasEdgeID(id) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		var e = this._und_edges[id];
		if ( e ) { 
			delete this._und_edges[id];
			return e;
		}
		e = this._in_edges[id];
		if ( e ) { 
			delete this._in_edges[id];
			return e;
		}
		e = this._out_edges[id];
		if ( e ) { 
			delete this._out_edges[id];
			return e;
		}
	}
	
	clearEdges() : void {
		this._in_edges = {};
		this._out_edges = {};
		this._und_edges = {};
	}
	
	prevNodes() : Array<IBaseNode> {
		var prevs = [];
		Object.keys(this._in_edges).forEach((e) => {
			prevs.push(this._in_edges[e].getNodes().a);
		});
		return prevs;
	}
	
	nextNodes() : Array<IBaseNode> {
		var nexts = [];
		Object.keys(this._out_edges).forEach((e) => {
			nexts.push(this._out_edges[e].getNodes().b);
		});
		return nexts;
	}
	
	connNodes() : Array<IBaseNode> {
		var conns = [];
		Object.keys(this._und_edges).forEach((e) => {
			conns.push(this._und_edges[e].getNodes().b);
		});
		return conns;
	}
	
}


export { IBaseNode, BaseNode };
