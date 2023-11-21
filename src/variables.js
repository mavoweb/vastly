/**
 * Recursively traverse the AST and return all top-level identifiers
 * @param {object} node the AST node to traverse
 * @returns a list of all top-level identifiers
 */
export default function variables(node) {
	switch(node.type) {
		case "Literal":
			return []
		case "UnaryExpression":
			return variables(node.argument);
		case "BinaryExpression":
		case "LogicalExpression":
			const {left, right} = node;
			return [left, right].flatMap(variables);
		case "ConditionalExpression":
			const {test, consequent, alternate} = node;
			return [test, consequent, alternate].flatMap(variables);
		case "Compound":
			return node.body.flatMap(variables);
		case "ArrayExpression":
			return node.elements.flatMap(variables);
		case "CallExpression":
			return [node.callee, ...node.arguments].flatMap(variables);
		case "MemberExpression":
			const {object, property, computed} = node;
			// only explore the property if it's a complex expression that might
			// have more identifiers
			// computed is true if the MemberExpression is of the form a[b] (need to explore further)
			// computed is false if the MemberExpression is of the form a.b (don't need to explore further)
			const propertyChildren = computed ? variables(property) : [];
			return variables(object).concat(propertyChildren);
		// Rest of the cases contain a single variable
		case "ThisExpression":
		case "Identifier":
		default:
			return [node];
	}
}
