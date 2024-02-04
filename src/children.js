/**
 * Get a node’s children as an array
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export function get (node) {
	return getDetails(node).map(({node}) => node);
}

/**
 * Get a node's children and the corresponding properties and indices
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export function getDetails (node) {
	if (Array.isArray(node)) {
		return node.flatMap(node => getDetails(node));
	}

	const nodeProperties = properties[node.type] ?? [];
	let children = [];

	for (const property of nodeProperties) {
		const child = node[property];
		// When the node is an array, we want to include the index in the result
		if (Array.isArray(child)) {
			children = children.concat(child.map((c, index) => ({node: c, property, index})));
		}
		else {
			children.push({node: child, property});
		}
	}
	return children;
}

/**
 * Which properties of a node are child nodes?
 * Can be imported and modified by calling code to add support for custom node types.
 * @type {Object.<string, Array<string>}
 */
export const properties = {
	CallExpression: ["arguments", "callee"],
	BinaryExpression: ["left", "right"],
	UnaryExpression: ["argument"],
	ArrayExpression: ["elements"],
	ConditionalExpression: ["test", "consequent", "alternate"],
	MemberExpression: ["object", "property"],
	Compound: ["body"],
};

// Old JSEP versions
properties.LogicalExpression = properties.BinaryExpression;
