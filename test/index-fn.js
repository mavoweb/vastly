let tests = await Promise.all([
	"evaluate",
	"walk",
	"find",
].map(name => import(`./${name}.js`).then(module => module.default)));


export default {
	name: "All vASTly tests",
	tests
}