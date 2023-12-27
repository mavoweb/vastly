let index = await fetch("./index.json").then(r => r.json());
let tests = await Promise.all(index.map(name => import(`./${name}.js`).then(module => module.default)));

export default {
	name: "All vASTly tests",
	tests
};
