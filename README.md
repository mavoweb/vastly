<header>

# vᴀꜱᴛly

Everything you need to support a custom expression language in your application.

</header>

<main>

## What is this?

vᴀꜱᴛly is a toolkit for handling expression ASTs (such as those produced by [JSEP](https://ericsmekens.github.io/jsep/)).
These ASTs are a subset of ASTs produced by full-blown parsers like [Esprima](https://esprima.org/).

Intended to be used in conjunction with [JSEP](https://ericsmekens.github.io/jsep/), but should work with any AST that conforms to the same structure.

Extracted from [Mavo](https://mavo.io).

## Features

- [x] Zero dependencies
- [x] Small footprint
- [x] Works in Node and the browser
- [x] Tree-shakeable

## Usage

```sh
npm i vastly
```

Then you can use it either by importing the whole library:

```js
import * as vastly from "vastly"; // or const vastly = require("vastly"); in CJS
import { parse } from "jsep";

const ast = parse("1 + x * y");
const result = vastly.evaluate(ast, {x: 2, y: 3});
```

or individual functions:

```js
import { evaluate } from "vastly"; // or const { evaluate } = require("vastly"); in CJS
import { parse } from "jsep";

const ast = parse("1 + x * y");
const result = evaluate(ast, {x: 2, y: 3});
```

If you’re using vastly from a browser, without a bundler, fear not! You can just import from `src` directly:

```js
import { evaluate } from "https://vastly.mavo.io/src/evaluate.js";
/* or */
import * as vastly from "https://vastly.mavo.io/src/index-fn.js";
/* or */
import { evaluate } from "https://vastly.mavo.io/dist/vastly.js";
/* or */
import * as vastly from "https://vastly.mavo.io/dist/vastly.js";
```

[Full API reference](https://vastly.mavo.io/docs/)

</main>