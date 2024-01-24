import jsep from "../node_modules/jsep/dist/jsep.min.js";
import path from "../src/path.js";
import {setAll} from "../src/parents.js";

const expr = "1 + foo(bar, 1 + baz * 2)";
const ast = jsep(expr);
const astWithParents = jsep(expr)
setAll(astWithParents);

export default {
	name: "path()",
	run (ancestor, descendant) {
		return path(ancestor, descendant);
	},
	tests: [
		{
			name: "Same node",
			args: [ast, ast],
			expect: []
		},
		{
			name: "Path length 1",
			args: [ast, ast.right],
			expect: ["right"]
		},
		{
			name: "Root to leaf",
			args: [ast, ast.right.arguments[1].right.left],
			expect: ["right", "arguments", 1, "right", "left"]
		},
		{
			name: "Non-root to non-leaf",
			args: [ast.right, ast.right.arguments[1]],
			expect: ["arguments", 1]
		},
		{
			name: "Non-root to leaf",
			args: [ast.right, ast.right.arguments[0]],
			expect: ["arguments", 0]
		},
		{
			name: "Non-existent path",
			args: [ast, jsep("dne")],
			expect: null
		},
		{
			name: "Root to leaf with parents",
			args: [astWithParents, astWithParents.right.arguments[1].right.left],
			expect: ["right", "arguments", 1, "right", "left"]
		},
	]
};
