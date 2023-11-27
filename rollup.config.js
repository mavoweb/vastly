import { getBabelOutputPlugin as babel } from '@rollup/plugin-babel';

const BASE_FILENAME = "vastly";
const IIFE_NAME = "Vastly";

function bundle(format) {
	let filename = BASE_FILENAME;

	if (format !== "esm") {
		filename += "." + format;
	}

	const plugins = [
		babel({
			presets: ["@babel/preset-env"],
			allowAllFormats: true,
		})
	];

	return {
		file: `src/${filename}.js`,
		name: IIFE_NAME,
		format,
		sourcemap: format !== "esm",
		plugins
	};
}

export default {
	input: "src/index.js",
	output: [
		bundle("iife"),
		bundle("esm"),
		bundle("cjs"),
	],
};