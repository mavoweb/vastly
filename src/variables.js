import * as parents from "./parents.js";

/**
 * Recursively traverse the AST and return all top-level identifiers
 * @param {object} node  
 * @param {object} [options]
 * @param {function(object): boolean} [options.filter] A function that returns true if the node should be included
 * @param {boolean} [options.addParents] If true, add a parent property to each node
 * @returns a list of all top-level identifiers
 */
export default function variables(node, {filter, addParents} = {}) {
	if (addParents) {
		parents.setAll(node);
	}

	function _variables(node) {
		switch(node.type) {
			case "Literal":
				return []
			case "UnaryExpression":
				return _variables(node.argument);
			case "BinaryExpression":
			case "LogicalExpression":
				const {left, right} = node;
				return [left, right].flatMap(_variables);
			case "ConditionalExpression":
				const {test, consequent, alternate} = node;
				return [test, consequent, alternate].flatMap(_variables);
			case "Compound":
				return node.body.flatMap(_variables);
			case "ArrayExpression":
				return node.elements.flatMap(_variables);
			case "CallExpression":
				return [node.callee, ...node.arguments].flatMap(_variables);
			case "MemberExpression":
				const {object, property} = node;
				// only explore the property if it's a complex expression that might
				// have more identifiers
				const propertyChildren = property.type === "Identifier" ? [] : _variables(property);
				return _variables(object).concat(propertyChildren);
			// Rest of the cases contain a single variable
			// Also check for filter condition
			case "ThisExpression":
			case "Identifier":
			default:
				const result = [];
				if (!filter || (filter && filter(node))) {
					result.push(node);
				}
				return result;
		}
	}

	return _variables(node);
}

