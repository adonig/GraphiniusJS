/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;


describe('==== EDGE TESTS ====', () => {
	var id = 'New Edge',
			label = 'New Edge',
			node_a = new Node("A"),
			node_b = new Node("B");
					
	
	describe('A basic edge instantiation', () => {

		/**
		 * An edge without nodes does not make any sense, HOWEVER:
		 * the edge itself does not check if any of the nodes it connects 
		 * are part of a graph - this is the job of the BaseGraph class!
		 */
		it('should refuse to instantiate an edge without two existing nodes', () => {
			var badConst = function() { return new Edge("free-float", null, null) };
			expect(badConst).to.throw("cannot instantiate edge without two valid node objects");
		});

		it('should refuse to instantiate an edge without two existing nodes', () => {
			var badConst = function() { return new Edge("free-float", new Node("A"), null) };
			expect(badConst).to.throw("cannot instantiate edge without two valid node objects");
		});

		it('should refuse to instantiate an edge without two existing nodes', () => {
			var badConst = function() { return new Edge("free-float", null, new Node("A") ) };
			expect(badConst).to.throw("cannot instantiate edge without two valid node objects");
		});

		it('should correctly set _id', () => {					
			var edge = new Edge(id, node_a, node_b);
			expect(edge.getID()).to.equal(id);
		});
		
		it('should correctly set _label upon instantiation', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).to.equal(label);
		});
		
		it('should correctly set _label upon renewed setting', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).to.equal(label);
			edge.setLabel('new Label');
			expect(edge.getLabel()).to.equal('new Label');
		});
		
	});


	describe('Edge FEATURE vector tests', () => {

		let feats: {[key: string]: any};
		let edge: $E.IBaseEdge;
		
		beforeEach( () => {
			feats = {name: 'Bernie', age: 36, present: 'laboring nobody', future: 'Billionaire'};
			edge = new $E.BaseEdge(id, node_a, node_b, {}, feats);
		});

			
		it('should correctly set default features to an empty hash object', () => {
			const featureless_edge = new $E.BaseEdge(id, node_a, node_b);
			expect(featureless_edge.getFeatures()).to.be.an.instanceof(Object);
			expect(featureless_edge.getFeatures()).to.be.empty;
		});
		
		it('should correctly set features to specified object', () => {
			expect(edge.getFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			expect(edge.getFeatures()).to.deep.equal(feats);
		});
		
		it('should return undefined upon trying to retrieve a non-set feature', () => {
			expect(edge.getFeature('menotexistsjabba')).to.be.undefined;
		});
		
		it('should correctly retrieve a set feature', () => {
			expect(edge.getFeature('future')).to.equal('Billionaire');			
		});
		
		it('should allow to set new feature', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.setFeature('founder', 'Lemontiger');
			expect(Object.keys(edge.getFeatures()).length).to.equal(5);
			expect(edge.getFeature('founder')).to.equal('Lemontiger');			
		});
		
		it('should automatically overwrite an existing feature upon renewed setting', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.setFeature('future', 'Bazillionaire');
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			expect(edge.getFeature('future')).to.equal('Bazillionaire');	
		});
		
		it('should return undefined upon trying to delete a non-set feature', () => {
			expect(edge.deleteFeature('menotexistsjabba')).to.be.undefined;
		});

		it('should duly return a given feature upon deletion', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			expect(edge.deleteFeature('age')).to.equal(36);
		});
		
		it('should duly eradicatea given feature', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.deleteFeature('age');
			expect(Object.keys(edge.getFeatures()).length).to.equal(3);
		});
		
		it('should allow to replace the whole feature vector', () => {
			var feats = {name: 'Bernie', age: '36', future: 'Billionaire'};
			var node = new $N.BaseNode(id, feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.setFeatures({});
			expect(Object.keys(node.getFeatures()).length).to.equal(0);	
		});
		
		it('should allow to clear the whole feature vector', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.clearFeatures();
			expect(Object.keys(edge.getFeatures()).length).to.equal(0);			
		});

		it('should return this pointer upon setFeature so we can chain methods', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.setFeature('founder', 'Lemontiger').setFeature('bla', 'hoo');
			expect(Object.keys(edge.getFeatures()).length).to.equal(6);
		});

		it('should return this pointer upon setFeatures so we can chain methods', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.setFeatures({'founder': 'Lemontiger'}).setFeature('bla', 'hoo');
			expect(Object.keys(edge.getFeatures()).length).to.equal(2);
		});

		it('should return this pointer upon clearFeatures so we can chain methods', () => {
			expect(Object.keys(edge.getFeatures()).length).to.equal(4);
			edge.clearFeatures().setFeature('bla', 'hoo');
			expect(Object.keys(edge.getFeatures()).length).to.equal(1);
		});

	});
	
	
	describe('Direction Edge Tests: ', () => {		
		// Constructor + isDirected()
		describe('Constructor + isDirected', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isDirected()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {directed: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isDirected()).to.equal(val);					
				});
			});
		});
		
	});
	
	/**
   * Right now, we are making a difference between
   * weighted and unweighted edges. An unweighted edge will
   * return undefined when queried for its weight, whereas
   * a weighted edge with unspecified weight defaults to w=1
   */
	describe('Weight Edge Tests', () => {		
    
		describe('Constructor + isWeighted', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {weighted: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isWeighted()).to.equal(val);					
				});
			});
		});
		
    
		describe('getWeight()', () => {
			it('should throw an exception when querying weight if unweighted', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
        expect(edge.getWeight()).to.be.undefined;
			});
			
			it('should correctly set default weight to 1', () => {
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(1);					
			});
			
			it('should correctly report weight if set & specified', () => {
				var opts = {weighted: true, weight: 42};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(42);					
			});
		});
    
    
		describe('setWeight()', () => {
			it('Should throw an error on trying to set a weight if unweighted', () => {
				var opts = {weighted: false};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(false);
				expect(edge.setWeight.bind(edge, 42)).to.throw("Cannot set weight on unweighted edge.");
			});
			
			it('Should correctly set weight to a specified value', () => {	
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);
				expect(edge.getWeight()).to.equal(1);			
				edge.setWeight(42);
				expect(edge.getWeight()).to.equal(42);
			});
		});		
	});
	
	
	describe('Node Edge Tests: ', () => {
		
		[true, false].forEach(function(direction) {
			it('all edges should properly return the two connected nodes', () => {
				var opts = {directed: direction};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isDirected()).to.equal(direction);
				var nodes = edge.getNodes();
				expect(nodes).to.be.an.instanceof(Object);			
				expect(nodes.a).to.be.an.instanceof(Node);
				expect(nodes.b).to.be.an.instanceof(Node);
				expect(nodes.a).to.equal(node_a);
				expect(nodes.b).to.equal(node_b);
			});
		});
				
	});


	/**
	 * As far as all cloning tests are concerned,
	 * the edge class is not responsible for connecting
	 * to the "correct" nodes, so in itself it does NOT
	 * check if the provided nodes
	 */
	describe('Edge CLONE Tests - ', () => {

		let node_a = new $N.BaseNode("A");
		let node_b = new $N.BaseNode("B");
		let edge : $E.IBaseEdge = null;
		let clone_edge : $E.IBaseEdge = null;


		beforeEach(() => {
			expect(edge).to.be.null;
			expect(clone_edge).to.be.null;
		});


		afterEach(() => {
			edge = null;
			clone_edge = null;
		});


		it('should refuse to clone if new node A is invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, null, node_b))
				.to.throw("refusing to clone edge if any new node is invalid");
		});


		it('should refuse to clone if new node B is invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, node_a, null))
				.to.throw("refusing to clone edge if any new node is invalid");
		});


		it('should refuse to clone if both nodes are invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, null, null))
				.to.throw("refusing to clone edge if any new node is invalid");
		});


		it('should clone a default edge with correct config options', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			clone_edge = edge.clone(node_a, node_b);
			expect(clone_edge.getID()).to.equal(edge.getID());
			expect(clone_edge.getLabel()).to.equal(edge.getLabel());
			expect(clone_edge.isDirected()).to.equal(edge.isDirected());
			expect(clone_edge.isWeighted()).to.equal(edge.isWeighted());
			expect(clone_edge.getWeight()).to.equal(edge.getWeight());
		});


		it('should clone a default edge with correct config options', () => {
			edge = new $E.BaseEdge("default", node_a, node_b, {
				directed: true,
				weighted: true,
				weight: -77,
				label: "different_from_ID"
			});
			clone_edge = edge.clone(node_a, node_b);
			expect(clone_edge.getID()).to.equal(edge.getID());
			expect(clone_edge.getLabel()).to.equal(edge.getLabel());
			expect(clone_edge.isDirected()).to.equal(edge.isDirected());
			expect(clone_edge.isWeighted()).to.equal(edge.isWeighted());
			expect(clone_edge.getWeight()).to.equal(edge.getWeight());
		});

	});

});
