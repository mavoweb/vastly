import * as parents from "./parents.js";

/**
 * Create a new MemberExpression node by combining an object and property
 * @param {object | string} object
 * @param {object | string} property
 * @param {*} [o]
 * @param {boolean} [o.computed] Whether to use computed syntax (e.g. `foo[bar]`) or dot syntax (e.g. `foo.bar`)
 */
export default function prepend (object, property, o = {}) {
	if (typeof object === "string") {
		object = stringToIdentifier(object);
	}
	if (typeof property === "string") {
		property = stringToIdentifier(property);
	}
	// if o.computed is set or if property cannot be used with dot syntax, use computed syntax.
	// types that are safe with dot syntax: Identifier, ThisExpression, CallExpression, and MemberExpressions with object.type === "Identifier"
	const computed = o.computed || !["Identifier", "ThisExpression"].includes(property.type) || (property.type === "MemberExpression" && property.object.type === "Identifier");
	let node;
	// complex case for CallExpressions
	if (property.type === "CallExpression") {
		const {callee, arguments: args} = property;
		node = {
			type: "CallExpression",
			arguments: args,
			callee: prepend(object, callee),
		};
	}
	else {
		node = {
			type: "MemberExpression",
			computed,
			object,
			property,
		};
	}
	// check for parents
	if (parents.get(object) !== undefined) {
		parents.set(object, node, {force: true});
	}

	if (parents.get(property) !== undefined) {
		parents.set(property, node, {force: true});
	}

	return node;
}


function stringToIdentifier (str) {
	return {
		type: "Identifier",
		name: str
	};
}
