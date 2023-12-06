import { childrenWithProperty } from "./children.js";
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
	const ignoreNode = o.except && matches(node, o.except);
	const copiedNode = {...node};

	if (!ignoreNode && matches(node, o.only)) {
		const callbackResult = callback(node, property, parent);
		const mappedNode = callbackResult ?? copiedNode;

		for (const {child, parentProperty} of childrenWithProperty(node)) {
			if (Array.isArray(child)) {
				mappedNode[parentProperty] = child.map(singleChild => _map(singleChild, callback, o, parentProperty, mappedNode));
			} else {
				mappedNode[parentProperty] = _map(child, callback, o, parentProperty, mappedNode);
			}
		}

		if (callbackResult !== undefined && parent) {
			// Callback returned a value, overwrite the node
			// We apply such transformations after walking, to avoid infinite recursion
			parent[property] = mappedNode;
		}

		return mappedNode;
	}

	return copiedNode;
}