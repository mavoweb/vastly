import * as parents from "./parents.js";

/**
 * Get a node’s children as an array
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export default function children (node) {
	if (Array.isArray(node)) {
		return node.flatMap(node => children(node));
	}

	let nodeProperties = properties[node.type] ?? [];
	return nodeProperties.flatMap(property => node[property] ?? []);
}

/**
 * Which properties of a node are child nodes?
 * Can be imported and modified by calling code to add support for custom node types.
 * @type {Object.<string, Array<string>}
 */
export const properties = children.properties = {
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

/**
 * Replace a child node with a new node by updating its parent
 * @param {object} child the node to replace
 * @param {object} newChild the replacement node
 */
export function replace (child, newChild) {
	const parent = parents.get(child);
	if (!parent) {
		return;
	}
	const childProperties = properties[parent.type];
	for (const prop of childProperties) {
		if (parent[prop] === child) {
			parent[prop] = newChild;
		}
		else if (Array.isArray(parent[prop])) {
			const index = parent[prop].indexOf(child);
			if (index !== -1) {
				parent[prop][index] = newChild;
			}
		}
	}
}
