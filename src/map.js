import children from "./children.js";
import { matches } from "./util.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
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
	let ignored = o.ignore && matches(node, o.ignore);

	if (!ignored && matches(node, o.only)) {
		let ret = callback(node, property, parent);

		for (let child of children(node)) {
			_map(child, callback, o, property, node);
		}

		if (ret !== undefined && parent) {
			// Callback returned a value, overwrite the node
			// We apply such transformations after walking, to avoid infinite recursion
			parent[property] = ret;
		}

		return ret;
	}
}