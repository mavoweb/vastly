import * as parents from "./parents.js";
import * as children from "./children.js";

/**
 * Create a new MemberExpression node by combining an object and property
 * @param {object} node
 * @param {object} prependee
 * @param {*} [o]
 * @param {boolean} [o.computed] Whether to use computed syntax (e.g. `foo[bar]`) or dot syntax (e.g. `foo.bar`)
 */
export default function prepend (node, prependee, o = {}) {
	const prependedNode = _prepend(node, prependee, o);
	children.replace(node, prependedNode);
	parents.update(prependedNode, {force: true});
	return prependedNode;
}



function _prepend (node, prependee, o = {}) {
	const computed = o.computed || !isValidDotSyntax(node);
	let prependedNode;
	// complex case for CallExpressions
	if (node.type === "CallExpression" && !computed) {
		const {callee, arguments: args} = node;
		prependedNode = {
			type: "CallExpression",
			arguments: args,
			callee: _prepend(callee, prependee),
		};
	}
	else if (node.type === "MemberExpression" && !computed) {
		// if the property is a MemberExpression, we need to prepend the object to the object of the MemberExpression
		prependedNode = {
			...node,
			object: _prepend(node.object, prependee)
		};
	}
	else {
		prependedNode = {
			type: "MemberExpression",
			computed,
			object: prependee,
			property: node
		};
	}

	return prependedNode;
}

function isValidDotSyntax (node) {
	const type = node.type;
	if (["Identifier", "ThisExpression", "CallExpression"].includes(type)) {
		return true;
	}
	if (type === "MemberExpression") {
		return isValidDotSyntax(node.object);
	}
	return false;
}
