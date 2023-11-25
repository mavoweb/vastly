import setParents from "./setParents.js";

export default function parse (str, parser = parse.defaultParser) {
	if (!parser) {
		throw new Error("No parser");
	}

	let ast = parser(str);
	setParents(ast);
	return ast;
}