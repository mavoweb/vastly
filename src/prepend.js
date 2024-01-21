import * as parents from "./parents.js";

/**
 * Create a new MemberExpression node by combining an object and property
 * @param {object | string} object
 * @param {object | string} property
 * @param {*} [o]
 * @param {boolean} [o.computed] Whether to use computed syntax (e.g. `foo[bar]`) or dot syntax (e.g. `foo.bar`)
 */
export default function prepend (object, property, o = {}) {
	object = convertToNode(object);
	property = convertToNode(property);

	const computed = o.computed || !isValidDotSyntax(property);
	let node;
	// complex case for CallExpressions
	if (property.type === "CallExpression" && !computed) {
		const {callee, arguments: args} = property;
		node = {
			type: "CallExpression",
			arguments: args,
			callee: prepend(object, callee),
		};
	}
	else if (property.type === "MemberExpression" && !computed) {
		// if the property is a MemberExpression, we need to prepend the object to the object of the MemberExpression
		node = {
			...property,
			object: prepend(object, property.object)
		};
	}
	else {
		node = {
			type: "MemberExpression",
			computed,
			object,
			property
		};
	}
	// check for parents here!

	return node;
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


function convertToNode (node) {
	if (typeof node === "string") {
		return {
			type: "Identifier",
			name: str
		};
	}
	return node;
}
