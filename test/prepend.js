import jsep from "../node_modules/jsep/dist/jsep.min.js";
import prepend from "../src/prepend.js";
import serialize from "../src/serialize.js";
import updateParents from "../lib/treecle/src/updateParents.js";

const nodes = [
	{str: '"bar"', computed: true}, // Literal
	{str: "foo", computed: false}, // Identifier
	{str: "foo[5].bar", computed: false}, // MemberExpression
	{str: "foo.bar()", computed: false}, // CallExpression
	{str: "2 + 5", computed: true}, // BinaryExpression
	{str: "!foo", computed: true}, // UnaryExpression
	{str: "foo ? bar : baz", computed: true}, // ConditionalExpression
];

const pairs = nodes.flatMap(({str: prependee}) => nodes.map(({str: node, computed}) => [node, prependee, computed]));

export default {
	name: "prepend()",
	run (node, prependee) {
		node = jsep(node);
		prependee = jsep(prependee);
		updateParents(node);
		updateParents(prependee);
		const combined = prepend(node, prependee);
		return serialize(combined);
	},
	tests: pairs.map(([node, prependee, computed]) => ({
		args: [node, prependee],
		expect: computed ? `${prependee}[${node}]` : `${prependee}.${node}`,
	})),
};
