import jsep from "../node_modules/jsep/dist/jsep.min.js";
import * as parents from "../src/parents.js";

const ast = jsep("1 + foo(bar.baz, 2)");
parents.update(ast);

export default {
	name: "parents",
	run (node) {
		return parents.path(node);
	},
	tests: [
		{
			name: "Root node",
			args: [ast],
			expect: null
		},
		{
			name: "Non-root node",
			args: [ast.right],
			expect: {node: ast, property: "right"}
		},
		{
			name: "Leaf node",
			args: [ast.right.arguments[0].object],
			expect: {node: ast.right.arguments[0], property: "object"}
		},
		{
			name: "Node with index",
			args: [ast.right.arguments[0]],
			expect: {node: ast.right, property: "arguments", index: 0}
		}
	]
};
