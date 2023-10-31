import jsep from "../node_modules/jsep/dist/jsep.min.js";
import find from "../src/find.js";
import serialize from "../src/serialize.js";

export default {
	name: "find()",
	run (str, ...args) {
		let ast = jsep(str);
		return serialize(find(ast, ...args));
	},
	tests: [
		{
			args: ["1 + (foo * 2)", node => node.type === "Identifier" && node.name === "foo"],
			expect: "foo"
		}
	]
}