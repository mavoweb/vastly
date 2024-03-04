import * as parents from "./parents.js";
import * as children from "./children.js";

/**
 * Create a new MemberExpression node by combining an object and property
 * @param {object} node
 * @param {object} prependee
 * @param {*} [o]
 * @param {boolean} [o.computed] Whether to use computed syntax (e.g. `foo[bar]`) or dot syntax (e.g. `foo.bar`)
 * @throws {Error} If the child node does not have a parent node set
 * @returns {object} The new prepended node
 */
export default function prepend(node, prependee, o = {}) {
	const prependedNode = _prepend(node, prependee, o);
	children.replace(node, prependedNode);
	parents.update(prependedNode, { force: true });
	return prependedNode;
}

// properties to recursively descend into when prepending
const descendTypes = {
	CallExpression: "callee",
	MemberExpression: "object",
};

function _prepend(node, prependee, o = {}) {
	// check if we use computed, e.g. foo[bar], or dot syntax, e.g. foo.bar
	const computed = o.computed || !isValidDotSyntax(node);
	let prependedNode;

	// we need to descend into the node to prepend
	if (node.type in descendTypes && !computed) {
		const descendProp = descendTypes[node.type];
		prependedNode = {
			...node,
			[descendProp]: _prepend(node[descendProp], prependee),
		};
	}
	// otherwise, we can just prepend to the node itself
	else {
		prependedNode = {
			type: "MemberExpression",
			computed,
			object: prependee,
			property: node,
		};
	}

	return prependedNode;
}

// checks if a node is a valid candidate for dot syntax
function isValidDotSyntax(node) {
	const type = node.type;
	if (["Identifier", "ThisExpression", "CallExpression"].includes(type)) {
		return true;
	}
	// walk up to top level MemberExpression to see if it's eligible
	if (type === "MemberExpression") {
		return isValidDotSyntax(node.object);
	}
	return false;
}
