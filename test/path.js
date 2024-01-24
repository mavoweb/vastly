import jsep from "../node_modules/jsep/dist/jsep.min.js";
import path from "../src/path.js";

const ast = jsep("1 + foo(bar, 1 + baz * 2)");

export default {
	name: "path()",
	run (ancestor, descendant) {
		return path(ancestor, descendant);
	},
	tests: [
		{
			args: [ast, ast],
			expect: [],
			description: "Same node"
		},
		{
			args: [ast, ast.right],
			expect: ["right"],
			description: "Path length 1"
		},
		{
			args: [ast, ast.right.arguments[1].right.left],
			expect: ["right", "arguments", 1, "right", "left"],
			description: "Root to leaf"
		},
		{
			args: [ast.right, ast.right.arguments[1]],
			expect: ["arguments", 1],
			description: "Non-root to non-leaf"
		},
		{
			args: [ast.right, ast.right.arguments[0]],
			expect: ["arguments", 0],
			description: "Non-root to leaf"
		},
		{
			args: [ast, jsep("dne")],
			expect: null,
			description: "Non-existent path"
		}
	]
};
