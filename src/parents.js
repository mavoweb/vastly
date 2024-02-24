import walk from "./walk.js";

const parentMap = new WeakMap();

/**
 * Set properties on each node pointing to its parent node.
 * Required for many vastly functions, e.g. `closest()`.
 * By default it will skip nodes that already have a `parent` property entirely, but you can set force = true to prevent that.
 * @param {*} node
 * @param {object} [options]
 * @param {boolean} [options.force] Overwrite existing `parent` properties
 */
export function update (node, options) {
	walk(node, (node, parentPath) => {
		// Make sure to pass in null as the parentPath if the node is the root
		let ret = set(node, parentPath ?? null, options);

		if (ret === false) {
			// We assume that if the node already has a parent, its subtree will also have parents
			return false;
		}
	});
}

/**
 * Set the `parent` property on a node.
 * By default it will skip nodes that already have a `parent` property, but you can set force = true to prevent that.
 * @param {object} node
 * @param {object | null} parentPath
 * @param {object} [options]
 * @param {boolean} [options.force] Allow overwriting
 */
export function set (node, parentPath, { force } = {}) {
	if (!force && parentMap.has(node)) {
		// We assume that if the node already has a parent, its subtree will also have parents
		return false;
	}

	if (parentPath === null) {
		// Node is the AST root
		parentMap.set(node, { node: null });
		return;
	}

	parentMap.set(node, parentPath);
}

/**
 * Get the parent node of a node.
 * @param {object} node
 * @returns {object | null | undefined} The parent node, or undefined if the node's parent is unknown
 */
export function get (node) {
	const {parent} = parentMap.get(node) ?? {};
	return parent;
}

/**
 * Get the parent node and metadata for a node.
 * @param {object} node
 * @returns {object | undefined} An object containing the parent node and the property name of the child node in the parent, or undefined if the node's parent is unknown
 */
export function path (node) {
	return parentMap.get(node);
}

/**
 * Clear a node's parent.
 * @param {object} node
 * @returns {boolean} True if the node had a parent and it was removed, false if the node had no parent
 */
export function clear (node) {
	return parentMap.delete(node);
}

/**
 * Clear all parent references from a node and its descendants.
 * @param {object} node
 */
export function clearAll (node) {
	walk(node, (node) => {
		clear(node);
	});
}
