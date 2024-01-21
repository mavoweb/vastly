import jsep from "../node_modules/jsep/dist/jsep.min.js";
import prepend from "../src/prepend.js";
import serialize from "../src/serialize.js";

export default {
	name: "prepend()",
	run (object, property, ...args) {
		object = jsep(object);
		property = jsep(property);
		const combined = prepend(object, property, ...args);
		return serialize(combined);
	},
	tests: [
		{
			args: ["foo", "bar"],
			expect: "foo.bar",
			description: "Two identifiers"
		},
		{
			args: ["foo", "bar", {computed: true}],
			expect: "foo[bar]",
			description: "Two identifiers, computed"
		},
		{
			args: ["foo", "bar()"],
			expect: "foo.bar()",
			description: "Identifier and call expression"
		},
		{
			args: ["foo[bar].baz", "foo.bar[baz]"],
			expect: "foo[bar].baz.foo.bar[baz]",
			description: "Complex member expressions"
		},
		{
			args: ["foo", "5"],
			expect: "foo[5]",
			description: "Identifier and literal"
		},
		{
			args: ["foo", "bar.baz", {computed: true}],
			expect: "foo[bar.baz]",
			description: "Identifier and member expression, computed"
		},
		{
			args: ["foo.bar", "baz", {computed: true}],
			expect: "foo.bar[baz]",
			description: "Member expression and identifier, computed"
		},
		{
			args: ["foo.bar", "baz.qux", {computed: true}],
			expect: "foo.bar[baz.qux]",
			description: "Member expression and member expression, computed"
		},
		{
			args: ["foo.bar", "baz()"],
			expect: "foo.bar.baz()",
			description: "Member expression and call expression"
		},
		{
			args: ["foo.bar", "baz()", {computed: true}],
			expect: "foo.bar[baz()]",
			description: "Member expression and call expression, computed"
		},
		{
			args: ["foo.bar", "baz.qux()"],
			expect: "foo.bar.baz.qux()",
			description: "Member expression and call expression"
		},
		{
			args: ["foo.bar", "baz.qux()", {computed: true}],
			expect: "foo.bar[baz.qux()]",
			description: "Member expression and call expression, computed"
		},
		{
			args: ["foo.bar", "baz[qux]"],
			expect: "foo.bar.baz[qux]",
			description: "Member expression and member expression, computed"
		}
	]
};
