import jsep from "../node_modules/jsep/dist/jsep.min.js";
import walk from "../src/walk.js";
import serialize from "../src/serialize.js";

export default {
	name: "walk()",
	run (str, ...args) {
		let ret = [];
		let ast = jsep(str);
		walk(ast, node => {
			ret.push(node);
		});
		return ret;
	},
	map: (arg) => {
		if (typeof arg === "string") {
			arg = jsep(arg);
		}

		return serialize(arg)
	},
	tests: [
		{
			args: ["1 + (foo * 2)"],
			expect: ["1 + (foo * 2)", "1", "foo * 2", "foo", "2"]
		}
	]
}