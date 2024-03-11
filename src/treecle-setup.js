// Set Treecle defaults
import { defaults } from "../lib/treecle/src/context.js";

/**
 * Which properties of a node are child nodes?
 * Can be imported and modified by calling code to add support for custom node types.
 * @type {Object.<string, Array<string>}
 */
export const properties = {
	CallExpression: ["arguments", "callee"],
	BinaryExpression: ["left", "right"],
	UnaryExpression: ["argument"],
	ArrayExpression: ["elements"],
	ConditionalExpression: ["test", "consequent", "alternate"],
	MemberExpression: ["object", "property"],
	Compound: ["body"],
};

// Old JSEP versions
properties.LogicalExpression = properties.BinaryExpression;

defaults.getChildProperties = (node) => {
	return properties[node.type] ?? [];
};

defaults.isNode = node => node && typeof node === "object" && typeof node.type === "string";
