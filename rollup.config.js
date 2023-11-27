const BASE_FILENAME = "vastly";
const IIFE_NAME = "Vastly";

function bundle(format, filenameAddition = "") {
	let filename = BASE_FILENAME;

	if (format !== "esm" && filenameAddition) {
		filename += "." + filenameAddition;
	}

	return {
		file: `src/${filename}.js`,
		name: IIFE_NAME,
		format,
		sourcemap: format !== "esm"
	};
}

export default {
	input: "src/index.js",
	output: [
		bundle("iife", "global"),
		bundle("esm"),
		bundle("cjs", "cjs"),
	],
};