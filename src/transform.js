import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";


/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
 * 
 * @param {object | object[]} node AST node or array of nodes
 * @param {Object.<string, function> | function(object, string, object?)} transformer
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function transform (node, transformer, o) {
	let callback;
	if (typeof transformer === "function") {
		callback = transformer;
	} else {
		callback = (node, property, parent) => {
			if (transformer[node.type]) {
				return transformer[node.type](node, property, parent);
			}
		};
	}
	_transform(node, callback, o);
}

function _transform (node, callback, o = {}, property, parent) {
	if (Array.isArray(node)) {
		return node.map(n => _transform(n, callback, o, property, parent));
	}

	const ignore = o.except && matches(node, o.except);
	const explore = !ignore && matches(node, o.only);
	
	if (explore) {
		const transformedNode = callback(node, property, parent);
		node = transformedNode !== undefined ? transformedNode : node;
		const properties = childProperties[node.type] ?? [];
		for (const prop of properties) {
			node[prop] = _transform(node[prop], callback, o, prop, node);
		}

		return node;
	}

	return node;
}