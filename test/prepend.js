import jsep from "../node_modules/jsep/dist/jsep.min.js";
import prepend from "../src/prepend.js";
import serialize from "../src/serialize.js";
import * as parents from "../src/parents.js";

export default {
	name: "prepend()",
	run (node, prependee, ...args) {
		node = jsep(node);
		prependee = jsep(prependee);
		parents.update(node);
		parents.update(prependee);
		const combined = prepend(node, prependee, ...args);
		return serialize(combined);
	},
	tests: [
		{
			args: ["bar", "foo"],
			expect: "foo.bar",
			description: "Two identifiers"
		},
		{
			args: ["bar", "foo", {computed: true}],
			expect: "foo[bar]",
			description: "Two identifiers, computed"
		},
		{
			args: ["bar()", "foo"],
			expect: "foo.bar()",
			description: "Identifier and call expression"
		},
		{
			args: [ "foo.bar[baz]", "foo[bar].baz"],
			expect: "foo[bar].baz.foo.bar[baz]",
			description: "Complex member expressions"
		},
		{
			args: ["5", "foo"],
			expect: "foo[5]",
			description: "Identifier and literal"
		},
		{
			args: [ "bar.baz", "foo", {computed: true}],
			expect: "foo[bar.baz]",
			description: "Identifier and member expression, computed"
		},
		{
			args: [ "baz", "foo.bar", {computed: true}],
			expect: "foo.bar[baz]",
			description: "Member expression and identifier, computed"
		},
		{
			args: ["baz.qux", "foo.bar", {computed: true}],
			expect: "foo.bar[baz.qux]",
			description: "Member expression and member expression, computed"
		},
		{
			args: ["baz()", "foo.bar"],
			expect: "foo.bar.baz()",
			description: "Member expression and call expression"
		},
		{
			args: ["baz()", "foo.bar", {computed: true}],
			expect: "foo.bar[baz()]",
			description: "Member expression and call expression, computed"
		},
		{
			args: ["baz.qux()", "foo.bar"],
			expect: "foo.bar.baz.qux()",
			description: "Member expression and call expression"
		},
		{
			args: ["baz.qux()", "foo.bar", {computed: true}],
			expect: "foo.bar[baz.qux()]",
			description: "Member expression and call expression, computed"
		},
		{
			args: ["baz[qux]", "foo.bar"],
			expect: "foo.bar.baz[qux]",
			description: "Member expression and member expression, computed"
		}
	]
};
