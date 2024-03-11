import "./treecle-setup.js";
import treecleTransform from "../lib/treecle/src/transform.js";

/**
 * Recursively execute a callback on this node and all its children.
 * If the callback returns a non-undefined value, it will overwrite the node.
 * This function will not modify the root node of the input AST.
 *
 * @param {object | object[]} node AST node or array of nodes
 * @param {Object.<string, function> | function(object, string, object?, object) | (Object.<string, function> | function(object, string, object?, object))[]} transformations A map of node types to callbacks, or a single callback that will be called for all node types, or a list of either, which will be applied in order
 * @param {object} [o]
 * @param {string | string[] | function} [o.only] Only walk nodes of this type
 * @param {string | string[] | function} [o.except] Ignore walking nodes of these types
 * @returns {object | object[]} The transformation's return value on the root node(s) of the input AST, or the root node(s) if the transformation did not return a value
 */
export default function transform (node, transformations, o) {
	if (!Array.isArray(transformations)) {
		transformations = [transformations];
	}

	// Treecle only accepts functions for transformations, convert any object with types to a function
	transformations = transformations.map(t => typeof t === "object" ? n => t[n.type] : t);

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

	return treecleTransform(node, transformations, o);
}