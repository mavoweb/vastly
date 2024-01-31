import jsep from "../node_modules/jsep/dist/jsep.min.js";
import * as parents from "../src/parents.js";

const ast = jsep("1 + foo(bar.baz, 2)");
parents.setAll(ast);

export default {
	name: "parents",
	run (node) {
		return parents.getWithMetadata(node);
	},
	tests: [
		{
			name: "Root node",
			args: [ast],
			expect: {parent: undefined}
		},
		{
			name: "Non-root node",
			args: [ast.right],
			expect: {parent: ast, property: "right"}
		},
		{
			name: "Leaf node",
			args: [ast.right.arguments[0].object],
			expect: {parent: ast.right.arguments[0], property: "object"}
		}
	]
};
