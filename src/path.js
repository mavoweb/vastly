import { properties } from "./children.js";
import * as parents from "./parents.js";

/**
 * Find a path from an ancestor node to a descendant node.
 * @param {object} ancestor the ancestor node to start the search from
 * @param {object} descendant the descendant node to search for
 * @returns {(string | number)[] | null} an array of keys to traverse to get from the ancestor to the descendant, or null if no path exists
 */
export default function path (ancestor, descendant) {
	if (parents.get(descendant)) {
		return parentPath(ancestor, descendant);
	}
	return defaultPath(ancestor, descendant);
}

function defaultPath (ancestor, descendant) {
	// Found descendant
	if (ancestor === descendant) {
		return [];
	}

	// Case where ancestor is an array for an array expression or compound etc
	if (Array.isArray(ancestor)) {
		for (let i = 0; i < ancestor.length; i++) {
			const childPath = defaultPath(ancestor[i], descendant);
			if (childPath) {
				return [i].concat(childPath);
			}
		}
		return null;
	}

	const childProperties = properties[ancestor.type] ?? [];

	for (const property of childProperties) {
		const childPath = defaultPath(ancestor[property], descendant);
		if (childPath) {
			return [property].concat(childPath);
		}
	}

	return null;
}

function parentPath (ancestor, descendant) {
	// walks up parent pointers until it finds the ancestor
	let path = [];
	let current = descendant;
	while (current !== ancestor) {
		const parent = parents.get(current);
		if (!parent) {
			return null;
		}
		const childProperties = properties[parent.type];
		for (const property of childProperties) {
			if (Array.isArray(parent[property])) {
				const index = parent[property].indexOf(current);
				if (index !== -1) {
					path = [property, index].concat(path);
					break;
				}
			}
			else if (parent[property] === current) {
				path.unshift(property);
				break;
			}
		}
		current = parent;
	}

	return path;
}