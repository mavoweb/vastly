import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";


/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
 * This function will not modify the root node of the input AST.
 * 
 * @param {object | object[]} node AST node or array of nodes
 * @param {function(object, string, object?)} transformCallback
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function transform (node, transformCallback, o) {
	_transform(node, transformCallback, o);
}

function _transform (node, callback, o = {}, property, parent) {
	if (Array.isArray(node)) {
		return node.map(n => _transform(n, callback, o, property, parent));
	}

	const ignore = o.except && matches(node, o.except);
	const explore = !ignore && matches(node, o.only);
	
	if (explore) {
		const transformedNode = callback(node, property, parent);
		if (transformedNode && node.parent) {
			transformedNode.parent = node.parent;
		}
		node = transformedNode !== undefined ? transformedNode : node;
		const properties = childProperties[node.type] ?? [];
		for (const prop of properties) {
			node[prop] = _transform(node[prop], callback, o, prop, node);
		}
	}

	return node;
}
