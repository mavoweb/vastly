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

function _prepend(node, prependee, o = {}) {
	const computed = o.computed || !isValidDotSyntax(node);
	let prependedNode;
	// if the node is a CallExpression, we need to prepend to the callee
	if (node.type === "CallExpression" && !computed) {
		const { callee, arguments: args } = node;
		prependedNode = {
			type: "CallExpression",
			arguments: args,
			callee: _prepend(callee, prependee),
		};
	}
	// if the node is a MemberExpression, we need to prepend to the object of the MemberExpression
	else if (node.type === "MemberExpression" && !computed) {
		prependedNode = {
			...node,
			object: _prepend(node.object, prependee),
		};
	} else {
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
	if (type === "MemberExpression") {
		return isValidDotSyntax(node.object);
	}
	return false;
}
