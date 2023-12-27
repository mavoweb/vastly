const markdownIt = require("markdown-it");
const anchor = require("markdown-it-anchor");
const pluginTOC = require("eleventy-plugin-toc");
const { globSync } = require("glob");

module.exports = eleventyConfig => {
	let data = {
		layout: "page.njk",
		permalink: "{{ page.filePathStem | replace('README', '') | replace('index', '') }}/index.html",
		tests: globSync("./test/*.js").map(path => path.replace(/^.+\/|\.m?js$/g, "")).filter(name => !name.startsWith("index")),
	};

	for (let p in data) {
		eleventyConfig.addGlobalData(p, data[p]);
	}

	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.setLibrary("md", markdownIt({
		html: true,
	})
		.disable("code")
		.use(anchor, {
			permalink: anchor.permalink.headerLink()
		})
	);

	eleventyConfig.addFilter(
		"relative",
		page => {
			let path = page.url.replace(/[^/]+$/, "");
			let ret = require("path").relative(path, "/");

			return ret || ".";
		}
	);

	eleventyConfig.addPlugin(pluginTOC);

	return {
		markdownTemplateEngine: "njk",
		templateFormats: ["md", "njk"],
		dir: {
			output: "."
		}
	};
};
