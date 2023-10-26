/**
 * Get a node’s children
 * @param {object | object[]} node or nodes
 * @returns {object[]}
 */
export default function children(node) {
	if (Array.isArray(node)) {
		return node.flatMap(node => children(node));
	}

	return childProperties.filter(property => node[property]).map(property => node[property]);
}





/**
 * Which properties of a node are child nodes?
 * Can be imported and manipulated by calling code to extend the walker
 * @type {string[]}
 */
export const childProperties = [
	"arguments", "callee", // CallExpression
	"left", "right", // BinaryExpression, LogicalExpression
	"argument", // UnaryExpression
	"elements", // ArrayExpression
	"test", "consequent", "alternate", // ConditionalExpression
	"object",  "property", // MemberExpression
	"body"
];