import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";
import * as parents from "./parents.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
 * This function will not modify the root node of the input AST.
 *
 * @param {object | object[]} node AST node or array of nodes
 * @param {Object.<string, function> | function(object, string, object?, object) | (Object.<string, function> | function(object, string, object?, object))[]} transformations A map of node types to callbacks, or a single callback that will be called for all node types, or a list of either, which will be applied in order
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 * @returns {object | object[]} The transformation's return value on the root node(s) of the input AST, or the root node(s) if the transformation did not return a value
 */
export default function transform (node, transformations, o) {
	if (!Array.isArray(transformations)) {
		transformations = [transformations];
	}
	return _transform(node, transformations, o);
}

function _transform (node, transformations, o = {}, property, parent, index) {
	if (Array.isArray(node)) {
		return node.map((n, i) => _transform(n, transformations, o, property, parent, i));
	}

	const ignore = o.except && matches(node, o.except);
	const explore = !ignore && matches(node, o.only);

	if (explore) {
		let transformedNode = node;
		for (const transformation of transformations) {
			const callback = typeof transformation === "object" ? transformation[transformedNode.type] : transformation;
			transformedNode = callback?.(transformedNode, property, parent, node);

			if (transformedNode === undefined) {
				transformedNode = node;
			}
		}
		node = transformedNode;

		if (parent) {
			if (index !== undefined) {
				parent[property][index] = node;
			} 
			else {
				parent[property] = node;
			}
			parents.set(node, parent, {force: true});
		}

		const properties = childProperties[node.type] ?? [];
		for (const prop of properties) {
			node[prop] = _transform(node[prop], transformations, o, prop, node);
		}
	}

	return node;
}
