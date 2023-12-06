import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node,
 * otherwise it will return a shallow clone.
 * @param {object} node
 * @param {function(object, string, object?)} callback
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function map (node, callback, o) {
	return _map(node, callback, o);
}

function _map (node, callback, o = {}, property, parent) {
	if (Array.isArray(node)) {
		return node.map(n => _map(n, callback, o, property, parent));
	}

	let ignore = o.except && matches(node, o.except);
	let explore = !ignore && matches(node, o.only);
	let ret;

	if (explore) {
		ret = callback(node, property, parent);
	}

	// Shallow clone if no function, or if the function returned undefined
	// If the function returned a value, we assume it takes care of this
	node = ret !== undefined ? ret : {...node};

	if (explore) {
		let properties = childProperties[node.type] ?? [];
		for (let prop of properties) {
			node[prop] = _map(node[prop], callback, o, prop, node);
		}
	}

	return ret;
}