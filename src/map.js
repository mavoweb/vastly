import { properties as childProperties } from "./children.js";
import { matches } from "./util.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, the new node will take that value,
 * otherwise it will return a shallow clone of the original.
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

	const ignore = o.except && matches(node, o.except);
	const explore = !ignore && matches(node, o.only);
	let copiedNode = {...node};

	if (explore) {
		const callbackResult = callback(node, property, parent);
		copiedNode = callbackResult !== undefined ? callbackResult : copiedNode;
		const properties = childProperties[copiedNode.type] ?? [];

		for (const prop of properties) {
			copiedNode[prop] = _map(copiedNode[prop], callback, o, prop, copiedNode);
		}
	}

	return copiedNode;
}