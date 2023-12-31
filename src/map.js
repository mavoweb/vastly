import transform from "./transform.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node,
 * otherwise it will return a shallow clone.
 * @param {object | object[]} node AST node or array of nodes
 * @param {function(object, string, object?)} callback
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function map (node, callback, o) {
	return transform(
		node,
		(node, property, parent) => {
			const ret = callback(node, property,parent);
			return ret !== undefined ? ret : {...node};
		},
		o
	)
}
