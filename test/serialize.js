import jsep from "../node_modules/jsep/dist/jsep.min.js";
import serialize from "../src/serialize.js";

export default {
	name: "serialize()",
	run (expr) {
		const ast = jsep(expr);
		return serialize(ast);
	},
	// Simple tests, should be beefed up in the future
	tests: [
		{
			args: ["1 + (foo * 2)"],
			expect: "1 + foo * 2"
		},
		{
			args: ["foo.bar.baz()"],
			expect: "foo.bar.baz()"
		}
	]
};
