import { childProperties } from "./children.js";
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

		for (const prop of getChildProperties(node)) {
			const child = node[prop];
			if (Array.isArray(child)) {
				mappedNode[prop] = child.map(singleChild => _map(singleChild, callback, o, prop, mappedNode));
			} else {
				mappedNode[prop] = _map(child, callback, o, prop, mappedNode);
			}
		}

		return mappedNode;
	}

	return copiedNode;
}

function getChildProperties (node) {
	return childProperties.filter(property => node[property]);
}