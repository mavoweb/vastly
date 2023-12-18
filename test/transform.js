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
			expect: "foo + bar + baz"
		},
		{
			args: [
				"foo",
				(node) => ({type: "Literal", value: `"${node.name}"`, raw: `"${node.name}"`})
			],
			expect: `"foo"`
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
			expect: "foo.foo + foo.foo.foo"
		},
		// rewrite of different node type
		{
			args: [
				"foo + bar * baz",
				(node) => {
					if (node.type === "BinaryExpression" && node.operator === "*") {
						return {name: "prod", type: "Identifier"};
					}
				}
			],
			expect: "foo + prod"
		}
	]
}