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
export function setAll (node, options ) {
	walk(node, (node, property, parent) => {
		let ret = set(node, parent, options);

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
 * @param {object} parent
 * @param {object} [options]
 * @param {boolean} [options.force] Allow overwriting
 */
export function set (node, parent, { force } = {}) {
	if (!force && parentMap.has(node)) {
		// We assume that if the node already has a parent, its subtree will also have parents
		return false;
	}
	parentMap.set(node, parent);
}

/**
 * Get the parent node of a node.
 * @param {object} node
 * @returns {object | undefined} The parent node, or undefined if the node has no parent
 */
export function get (node) {
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
