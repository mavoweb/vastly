import walk from "./walk.js";

/**
 * Find an AST node and return it, or `null` if not found.
 * @param {object | object[]} node
 * @param {function(object): boolean} callback
 */
export default function find (node, callback) {
	return walk(node, node => {
		if (callback(node)) {
			return node;
		}
	}) ?? null;
}
