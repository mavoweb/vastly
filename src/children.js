import * as parents from "./parents.js";

/**
 * Get a node’s children as an array
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export default function children (node) {
	return paths(node).map(({node}) => node);
}

/**
 * Get a node's children and the corresponding properties and indices
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export function paths (node) {
	if (Array.isArray(node)) {
		// when node is an array, flatten to avoid nested arrays of children
		return node.flatMap(node => paths(node));
	}

	const childProperties = properties[node.type] ?? [];
	let children = [];

	for (const property of childProperties) {
		const child = node[property];
		// When the node is an array, we want to include the index in the result
		if (Array.isArray(child)) {
			children = children.concat(child.map((c, index) => ({node: c, property, index})));
		}
		else {
			children.push({node: child, property});
		}
	}
	return children;
}

/**
 * Replaces a child node with a new node, and updates the parent node and parent pointers
 * @param {object} child 
 * @param {object} newChild 
 */
export function replace (child, newChild) {
	const parentPath = parents.path(child);
	if (parentPath) {
		const {property, index, node: parent} = parentPath;
		
		if (index !== undefined) {
			parent[property][index] = newChild;
		}
		else {
			parent[property] = newChild;
		} 

		parents.clear(child);
		parents.set(newChild, parentPath, {force: true});
	}
}

/**
 * Which properties of a node are child nodes?
 * Can be imported and modified by calling code to add support for custom node types.
 * @type {Object.<string, Array<string>}
 */
export const properties = {
	CallExpression: ["arguments", "callee"],
	BinaryExpression: ["left", "right"],
	UnaryExpression: ["argument"],
	ArrayExpression: ["elements"],
	ConditionalExpression: ["test", "consequent", "alternate"],
	MemberExpression: ["object", "property"],
	Compound: ["body"],
};

// Old JSEP versions
properties.LogicalExpression = properties.BinaryExpression;
export {children as of};
