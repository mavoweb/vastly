import walk from "./walk.js";
import { properties } from "./children.js";

const parentMap = new WeakMap();

/**
 * Set properties on each node pointing to its parent node.
 * Required for many vastly functions, e.g. `closest()`.
 * By default it will skip nodes that already have a `parent` property entirely, but you can set force = true to prevent that.
 * @param {*} node
 * @param {object} [options]
 * @param {boolean} [options.force] Overwrite existing `parent` properties
 * @throws {Error} If one of the nodes is not found in its parent
 */
export function setAll (node, options ) {
	walk(node, (node, property, parent) => {
		try {
			const ret = set(node, parent, options);
			if (ret === false) {
				// We assume that if the node already has a parent, its subtree will also have parents
				return false;
			}
		}
		catch (e) {
			throw new Error(`Could not set parent for node of type ${node.type} at ${property} in parent of type ${parent.type}`);
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
 * @throws {Error} If there is no way to get to the child node from the parent
 */
export function set (node, parent, { force } = {}) {
	if (!force && parentMap.has(node)) {
		// We assume that if the node already has a parent, its subtree will also have parents
		return false;
	}

	if (parent === undefined) {
		parentMap.delete(node);
		return;
	}

	if (parent === null) {
		// Node is the AST root
		parentMap.set(node, { parent: null });
		return;
	}

	const parentProps = properties[parent?.type] ?? [];

	// Find the property name and index of the child node in the parent
	for (const property of parentProps) {
		const child = parent[property];
		if (Array.isArray(child)) {
			// When the child is an array, we also need to figure out index
			const index = child.indexOf(node);
			if (index !== -1) {
				parentMap.set(node, {parent, property, index});
				return;
			}
		}
		else if (child === node) {
			parentMap.set(node, {parent, property});
			return;
		}
	}

	throw new Error("No path to child node from parent");
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
export function getDetails (node) {
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
