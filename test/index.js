import run from "../node_modules/htest.dev/src/js/cli.js";
import tests from "./index-fn.js";

let argv = process.argv.slice(2);

run(argv[0] || tests);