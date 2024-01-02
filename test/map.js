import jsep from "../node_modules/jsep/dist/jsep.min.js";
import map from "../src/map.js";
import serialize from "../src/serialize.js";

export default {
	name: "map()",
	run (str, ...args) {
		const ast = jsep(str);
		const mappedAst = map(ast, ...args);
		return [serialize(ast), serialize(mappedAst)];
	},
	// Tests expect an array of the form [serialized input AST, expected output AST]
	// This is to ensure the original AST was not mutated during mapping.
	tests: [
		{
			args: ["foo + bar + baz", () => undefined],
			expect: ["foo + bar + baz", "foo + bar + baz"],
			description: "Empty callback"
		},
		{
			args: [
				"foo.bar + foo.bar.baz",
				(node) => {
					if (node.type === "Identifier" && node.name !== "foo") {
						return {...node, name: "foo"};
					}
				}
			],
			expect: ["foo.bar + foo.bar.baz",  "foo.foo + foo.foo.foo"],
			description: "Rewrite tree of size > 1"
		},
		{
			args: [
				"foo + bar * baz",
				(node) => {
					if (node.type === "BinaryExpression" && node.operator === "*") {
						return {name: "prod", type: "Identifier"};
					}
				}
			],
			expect: ["foo + bar * baz", "foo + prod"],
			description: "Rewrite to different node type"
		},
		{
			args: [
				"foo.bar + foo.bar.baz",
				{
					Identifier: (node) => {
						if (node.name !== "foo") {
							return {...node, name: "foo"};
						}
					}
				}
			],
			expect: ["foo.bar + foo.bar.baz", "foo.foo + foo.foo.foo"],
			description: "Use object literal spec"
		}
	]
};
