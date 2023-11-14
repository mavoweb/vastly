import children from "./children.js";
import { matches } from "./util.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, walking ends and the value is returned
 * @param {object} node
 * @param {function(object, string, object?)} callback
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function walk (node, callback, o) {
	return _walk(node, callback, o);
}

function _walk(node, callback, o = {}, property, parent) {
	let ignored = o.ignore && matches(node, o.except);

	if (!ignored && matches(node, o.only)) {
		let ret = callback(node, property, parent);

		if (ret !== undefined) {
			// Callback returned a value, stop walking and return it
			return ret;
		}

		for (let child of children(node)) {
			_walk(child, callback, o, property, node);
		}
	}
}