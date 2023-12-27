import map from "./map.js";

/**
 * How to evaluate each unary operator.
 * Can be imported and modified by calling code.
 */
export const unaryOperators = {
	"!": a => !a,
	"+": a => +a,
	"-": a => -a,
};

/**
 * How to evaluate each binary operator.
 * Can be imported and modified by calling code.
 */
export const binaryOperators = {
	// Math
	"+": (a, b) => a + b,
	"-": (a, b) => a - b,
	"*": (a, b) => a * b,
	"/": (a, b) => a / b,
	"%": (a, b) => a % b,
	"**": (a, b) => a ** b,

	// Bitwise
	"&": (a, b) => a & b,
	"|": (a, b) => a | b,
	"^": (a, b) => a ^ b,
	">>": (a, b) => a >> b,
	">>>": (a, b) => a >>> b,
	"<<": (a, b) => a << b,

	// Logical
	"&&": (a, b) => a && b,
	"||": (a, b) => a || b,
	"??": (a, b) => a ?? b,

	// Comparison
	"==": (a, b) => a == b,
	"!=": (a, b) => a != b,
	"===": (a, b) => a === b,
	"!==": (a, b) => a !== b,
	"<": (a, b) => a < b,
	"<=": (a, b) => a <= b,
	">": (a, b) => a > b,
	">=": (a, b) => a >= b,

	// Other
	"in": (a, b) => a in b,
	"instanceof": (a, b) => a instanceof b,

};

/**
 * How to evaluate each AST type.
 * Can be imported and modified by calling code.
 */
export const evaluators = {
	"UnaryExpression": (node, ...contexts) => {
		let operator = unaryOperators[node.operator];
		if (!operator) {
			throw new TypeError(`Unknown unary operator ${node.operator}`, {
				code: "UNKNOWN_UNARY_OPERATOR",
				node,
			});
		}

		return operator(evaluate(node.argument, ...contexts));
	},

	"BinaryExpression": (node, ...contexts) => {
		let operator = binaryOperators[node.operator];
		if (!operator) {
			throw new TypeError(`Unknown binary operator ${node.operator}`, {
				code: "UNKNOWN_BINARY_OPERATOR",
				node,
			});
		}

		return operator(evaluate(node.left, ...contexts), evaluate(node.right, ...contexts));
	},

	"ConditionalExpression": (node, ...contexts) => {
		return evaluate(evaluate(node.test, ...contexts) ? node.consequent : node.alternate, ...contexts);
	},

	"MemberExpression": (node, ...contexts) => {
		let object = evaluate(node.object, ...contexts);
		let property = node.computed ? evaluate(node.property, ...contexts) : node.property.name;

		if (!object) {
			throw new TypeError(`Cannot read properties of ${object} (reading '${property}')`, {
				code: "PROPERTY_REF_EMPTY_OBJECT",
				node,
				contexts,
			});
		}

		return object[property];
	},

	"CallExpression": (node, ...contexts) => {
		let callee = evaluate(node.callee, ...contexts);
		let args = node.arguments.map(arg => evaluate(arg, ...contexts));
		return callee(...args);
	},

	"ArrayExpression": node => node.elements.map(node => evaluate(node, ...contexts)),
	"Compound": (node, ...contexts) => evaluate(node.body.at(-1), ...contexts),
	"Identifier": (node, ...contexts) => resolve(node.name, ...contexts),
	"Literal": node => node.value,
	"ThisExpression": (node, ...contexts) => contexts[0],
};

/**
 * Evaluate an AST node into a value.
 * @param {object} node AST node to evaluate
 * @param {...object} contexts - Objects to look up identifiers in (in order).
 * 		E.g. the first could be local data, the second could be global data.
 */
export default function evaluate (node, ...contexts) {
	if (node.type in evaluators) {
		return evaluators[node.type](node, ...contexts);
	}

	throw new TypeError(`Cannot evaluate node of type ${node.type}`, {
		code: "UNKNOWN_NODE_TYPE",
		node,
	});
}

evaluate.evaluators = evaluators;

function resolve (property, ...contexts) {
	let context = contexts.find(context => property in context);

	return context?.[property];
}
