/**
 * Functions to serialize each specific node type.
 * Can be imported and overwritten by calling code.
 * @type {Object.<string, Function>}
 *
 */
export const serializers = {
	"BinaryExpression": node => `${serialize(node.left, node)} ${node.operator} ${serialize(node.right, node)}`,
	"UnaryExpression": node => `${node.operator}${serialize(node.argument, node)}`,
	"CallExpression": node => {
		let callee = serialize(node.callee, node);
		let args = node.arguments.map(n => serialize(n, node));
		return `${callee}(${args.join(", ")})`;
	},
	"ConditionalExpression": node => `${serialize(node.test, node)} ? ${serialize(node.consequent, node)} : ${serialize(node.alternate, node)}`,
	"MemberExpression": node => {
		let property = node.computed? `[${serialize(node.property, node)}]` : `.${node.property.name}`;
		let object = serialize(node.object, node);
		return `${object}${property}`;
	},
	"ArrayExpression": node => `[${node.elements.map(n => serialize(n, node)).join(", ")}]`,
	"Literal": node => node.raw,
	"Identifier": node => node.name,
	"ThisExpression": node => "this",
	"Compound": node => node.body.map(n => serialize(n, node)).join(", ")
};

/**
 * Recursively serialize an AST node into a JS expression
 * @param {*} node
 * @returns {string} Serialized expression
 */
export default function serialize (node) {
	if (!node || typeof node === "string") {
		return node; // already serialized
	}

	if (!node.type) {
		throw new TypeError(`AST node ${node} has no type`, {
			cause: {
				code: "NODE_MISSING_TYPE",
				node,
			}
		});
	}

	if (!serializers[node.type]) {
		throw new TypeError(`No serializer found for AST node with type '${ node.type }'`, {
			cause: {
				code: "UNKNOWN_NODE_TYPE",
				node,
			}
		});
	}

	return serializers[node.type](node);
}

serialize.serializers = serializers;
