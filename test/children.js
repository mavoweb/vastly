import jsep from "../node_modules/jsep/dist/jsep.min.js";
import * as children from "../src/children.js";

const ast = jsep("1 + foo(bar.baz, 2)");

export default {
	name: "children",
	run (node) {
		return children.getDetails(node);
	},
	tests: [
		{
			name: "Root node",
			args: [ast],
			expect: [{node: ast.left, property: "left"}, {node: ast.right, property: "right"}]
		},
		{
			name: "Non-root node with children",
			args: [ast.right],
			expect: [{node: ast.right.arguments[0], property: "arguments", index: 0}, {node: ast.right.arguments[1], property: "arguments", index: 1}, {node: ast.right.callee, property: "callee"}],
		},
		{
			name: "Leaf node",
			args: [ast.left],
			expect: [],
		}
	]
};
