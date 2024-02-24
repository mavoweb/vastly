import { update as setParents } from "./parents.js";

/**
 * Parses an expression into an AST, sets parent references, and returns the AST
 * @param {string} str
 * @param {object} [options]
 * @param {function} [options.parser] - A function that takes a string and returns an AST. Defaults to `parse.defaultParser`
 * @returns {object}
 */
export default function parse (str, { parser = parse.defaultParser } = {}) {
	if (!parser) {
		throw new Error("No parser found", {
			code: "NO_PARSER",
		});
	}

	let ast = parser(str);
	setParents(ast);
	return ast;
}
