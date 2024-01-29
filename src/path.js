import { properties } from "./children.js";

/**
 * Find a path from an ancestor node to a descendant node.
 * @param {object} ancestor the ancestor node to start the search from
 * @param {object} descendant the descendant node to search for
 * @returns {(string | number)[] | null} an array of keys to traverse to get from the ancestor to the descendant, or null if no path exists
 */
export default function path (ancestor, descendant) {
	// Found descendant
	if (ancestor === descendant) {
		return [];
	}

	// Case where ancestor is an array for an array expression or compound etc
	if (Array.isArray(ancestor)) {
		for (let i = 0; i < ancestor.length; i++) {
			const childPath = path(ancestor[i], descendant);
			if (childPath) {
				return [i].concat(childPath);
			}
		}
		return null;
	}

	const childProperties = properties[ancestor.type] ?? [];

	for (const property of childProperties) {
		const childPath = path(ancestor[property], descendant);
		if (childPath) {
			return [property].concat(childPath);
		}
	}

	return null;
}
