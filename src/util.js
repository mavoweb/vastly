export function matches (node, filter) {
	if (!filter) {
		return true;
	}

	if (Array.isArray(filter)) {
		// Multiple filters: OR
		return filter.some(f => matches(node, f));
	}

	if (typeof filter === "function") {
		return filter(node);
	}

	// Coerce to string, if we're here we have no other way to compare
	return node.type == filter;
}
