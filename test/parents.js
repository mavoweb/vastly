import jsep from "../node_modules/jsep/dist/jsep.min.js";
import * as parents from "../src/parents.js";

const ast = jsep("1 + foo(bar.baz, 2)");
parents.setAll(ast);

export default {
	name: "parents",
	run (node) {
		return parents.get(node);
	},
	tests: [
		{
			name: "Root node",
			args: [ast],
			expect: undefined
		},
		{
			name: "Non-root node",
			args: [ast.right],
			expect: ast
		},
		{
			name: "Leaf node",
			args: [ast.right.arguments[0].object],
			expect: ast.right.arguments[0]
		}
	]
};
