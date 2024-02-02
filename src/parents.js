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
	const metadata = findParentProp(node, parent);
	parentMap.set(node, {parent, ...metadata});
}

/**
 * Get the parent node of a node.
 * @param {object} node
 * @returns {object | undefined} The parent node, or undefined if the node has no parent
 */
export function get (node) {
	const {parent} = parentMap.get(node) ?? {};
	return parent;
}

/**
 * Get the parent node and metadata for a node.
 * @param {object} node
 * @returns {object | undefined} An object containing the parent node and the property name of the child node in the parent
 */
export function getDetails (node) {
	return parentMap.get(node);
}

function findParentProp (node, parent) {
	const parentProps = properties[parent?.type] ?? [];

	for (const property of parentProps) {
		const child = parent[property];
		if (Array.isArray(child)) {
			const index = child.indexOf(node);
			if (index !== -1) {
				return {property, index};
			}
		}
		else if (child === node) {
			return {property};
		}
	}

	return {};
}