import jsep from "../node_modules/jsep/dist/jsep.min.js";
import map from "../src/map.js";
import serialize from "../src/serialize.js";

export default {
	name: "map()",
	run (str, ...args) {
		const ast = jsep(str);
        const mappedAst = map(ast, ...args);
        return [serialize(ast), serialize(mappedAst)];
	},
    // Simple tests, these should be expanded some day
	tests: [
		{
			args: ["foo + bar + baz", () => undefined],
			expect: ["foo + bar + baz", "foo + bar + baz"]
		},
        {
			args: ["foo.bar + foo.bar.baz", (node) => node.type === "Identifier" && node.name !== "foo" ? {...node, name: "foo"} : undefined],
			expect: ["foo.bar + foo.bar.baz",  "foo.foo + foo.foo.foo"]
		},
	]
}