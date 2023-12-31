import jsep from "../node_modules/jsep/dist/jsep.min.js";
import transform from "../src/transform.js";
import serialize from "../src/serialize.js";

export default {
	name: "transform()",
	run (str, ...args) {
		const ast = jsep(str);
		transform(ast, ...args);
		return serialize(ast);
	},
	tests: [
		{
			args: ["foo + bar + baz", () => undefined],
			expect: "foo + bar + baz",
			description: "Empty transform"
		},
		{
			args: [
				"foo",
				(node) => ({...node, name: "bar"}),
			],
			expect: `foo`,
			description: "Does not modify root node"
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
			expect: "foo.foo + foo.foo.foo",
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
			expect: "foo + prod",
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
			expect: "foo.foo + foo.foo.foo",
			description: "Use object literal spec"
		},
		{
			args: [
				"foo + bar * baz",
				[
					(node) => {
						if (node.type === "BinaryExpression" && node.operator === "*") {
							return {name: "prod", type: "Identifier"};
						}
					},
					{
						Identifier: (node) => {
							if (node.name !== "foo") {
								return {...node, name: "foo"};
							}
						}
					},
				]
			],
			expect: "foo + foo",
			description: "Use array of callbacks"
		}
	]
};
