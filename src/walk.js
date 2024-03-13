import "./treecle-setup.js";
import treecleWalk from "../lib/treecle/src/walk.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, walking ends and the value is returned
 * @param {object} node
 * @param {function(object, object?)} callback
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 */
export default function walk (node, callback, o) {
	// Convert string filters to functions for Treecle
	o = Object.assign({}, o); // clone to avoid modifying the input object
	if (typeof o.only === "string") {
		let type = o.only;
		o.only = n => n.type === type;
	}
	if (typeof o.except === "string") {
		let type = o.except;
		o.except = n => n.type === type;
	}

	return treecleWalk(node, callback, o);
}
