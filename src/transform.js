import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";
import * as parents from "./parents.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
 * This function will not modify the root node of the input AST.
 *
 * @param {object | object[]} node AST node or array of nodes
 * @param {Object.<string, function> | function(object, string, object?)} transformation A map of node types to callbacks, or a single callback that will be called for all node types
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 * @returns {object | object[]} The transformation's return value on the root node(s) of the input AST, or the root node(s) if the transformation did not return a value
 */
export default function transform (node, transformation, o) {
	return _transform(node, transformation, o);
}

function _transform (node, transformation, o = {}, property, parent) {
	if (Array.isArray(node)) {
		return node.map(n => _transform(n, transformation, o, property, parent));
	}

	const ignore = o.except && matches(node, o.except);
	const explore = !ignore && matches(node, o.only);

	if (explore) {
		let transformedNode;
		if (typeof transformation === "function") {
			transformedNode = transformation(node, property, parent);
		}
		else if (typeof transformation === "object") {
			transformedNode = transformation[node.type]?.(node, property, parent);
		}
		node = transformedNode !== undefined ? transformedNode : node;
		parents.set(node, parent, {force: true});
		const properties = childProperties[node.type] ?? [];
		for (const prop of properties) {
			node[prop] = _transform(node[prop], transformation, o, prop, node);
		}
	}

	return node;
}
