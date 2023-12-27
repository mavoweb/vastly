import jsep from "../node_modules/jsep/dist/jsep.min.js";
import evaluate from "../src/evaluate.js";

export default {
	name: "evaluate()",
	run: function evaluateStr (str, ...args) {
		return evaluate(jsep(str), ...args);
	},
	tests: [
		{
			name: "addition",
			args: ["1 + 2"],
			expect: 3
		},
		{
			name: "Variables",
			tests: [
				{
					name: "Single",
					args: ["foo", {foo: 1}],
					expect: 1
				},
				{
					name: "Multiple",
					args: ["foo + bar", {foo: 1}, {bar: 2}],
					expect: 3
				},
			]
		},
	]
};
