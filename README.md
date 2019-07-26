<!--
Template tags:
bumble-org
rollup-plugin-bundle-imports
IMG_URL
-->

<p align="center">
  <a href="https://github.com/bumble-org/rollup-plugin-bundle-imports" rel="noopener">
  <img width=200px height=200px src="https://imgur.com/3E9Rowk.png" alt="rollup-plugin-bundle-imports logo"></a>
</p>

<h3 align="center">rollup-plugin-bundle-imports</h3>

<div align="center">

[![npm (scoped)](https://img.shields.io/npm/v/rollup-plugin-bundle-imports.svg)](https://www.npmjs.com/package/${}/rollup-plugin-bundle-imports)
[![GitHub last commit](https://img.shields.io/github/last-commit/bumble-org/rollup-plugin-bundle-imports.svg)](https://github.com/bumble-org/rollup-plugin-bundle-imports)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![TypeScript Declarations Included](https://img.shields.io/badge/types-TypeScript-informational)](#typescript)

</div>

<div align="center">

[![Fiverr: We make Chrome extensions](https://img.shields.io/badge/Fiverr%20-We%20make%20Chrome%20extensions-brightgreen.svg)](https://www.fiverr.com/jacksteam)
[![ko-fi](https://img.shields.io/badge/ko--fi-Buy%20me%20a%20coffee-ff5d5b)](https://ko-fi.com/K3K1QNTF)

</div>

---

Bundle imports separately and use the result as [a file path](https://github.com/bumble-org/rollup-plugin-bundle-imports#bundle-a-service-worker) or [a string of code](https://github.com/bumble-org/rollup-plugin-bundle-imports#bundle-a-web-extension-content-script). Tested to work [recursively](https://github.com/bumble-org/rollup-plugin-bundle-imports#recursive-usage) or as multiple plugin instances with different options.

If you are coming here from [`rollup-plugin-code-string`](https://www.npmjs.com/package/rollup-plugin-code-string), the API has become more robust, [but the defaults will work the same!](https://github.com/bumble-org/rollup-plugin-bundle-imports#default-settings)

## Table of Contents

- [Getting Started](#getting_started)
- [Usage](#usage)
  - [Bundle a service worker](#usage-sw)
  - [Bundle a Chrome extension content script](#usage-script)
  - [Recursive Usage](#usage-recursive)
- [Features](#features)
  - [Works With TypeScript](#typescript)
- [Options API](#options-api)

## Getting started <a name = "getting_started"></a>

This is a Rollup plugin, so your project will need to be up and running with [Rollup](https://rollupjs.org/guide/en/).

### Installation

```sh
$ npm i rollup-plugin-bundle-imports -D
```

## Usage <a name = "usage"></a>

```js
// rollup.config.js

import bundleImports from 'rollup-plugin-bundle-imports'

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle-esm.js',
    format: 'esm',
  }
  plugins: [bundleImports()],
}
```

Default is to import a module that ends in `.code.js` as a string.

```js
import code from './script.code.js'
```

### Bundle a service worker <a name = "usage-sw"></a>

Use `options.importAs` to bundle an imported module and emit it as an asset file. The imported value will be the file path to the asset.

```js
// rollup.config.js

import bundleImports from 'rollup-plugin-bundle-imports'

export default {
  input: 'register-service-worker.js',
  plugins: [
    bundleImports({
      include: ['**/my-sw.js'],
      // Import as path to bundle
      importAs: 'path',
    }),
  ],
}
```

```js
// register-service-worker.js

import swPath from './my-sw.js'

navigator.serviceWorker.register(swPath)
```

### Bundle a Chrome extension content script <a name = "usage-script"></a>

Bundle a content script to a code string to inject from the background page of a Web or Chrome extension.

```js
// rollup.config.js

import { bundleImports } from 'rollup-plugin-bundle-imports'

export default {
  input: 'background.js',
  plugins: [
    bundleImports({
      include: ['**/content.js', '**/inject.js'],
      // Import as code string to bundle
      importAs: 'code',
    }),
  ],
}
```

```js
// background.js

import code from './content.js'

// Inject the bundled code to the active tab
browser.tabs.executeScript({ code })
```

### Recursive Usage <a name = "usage-recursive"></a>

Inject the bundled code from the content script of the previous example into the page runtime through a script tag.

```js
// content.js

import code from './inject.js'

const script = document.createElement('script')
script.text = code

document.head.append(script)
script.remove()
```

### Import both code and paths

If you want to import some files as code and others as file paths, just create two plugins with different settings!

Both plugin instances will work recursively with each other, so you can import a path into a code string, or import a code string into an asset and import the asset path into your entry bundle.

```js
// rollup.config.js

import bundleImports from 'rollup-plugin-bundle-imports'

export default {
  input: 'index.js',
  plugins: [
    bundleImports({
      include: ['**/my-sw.js'],
      // Import as path to bundle
      importAs: 'path',
    }),
    bundleImports({
      include: ['**/content.js', '**/inject.js'],
      // Import as code string to bundle
      importAs: 'code',
    }),
  ],
}
```

## Features <a name = "features"></a>

### Works With TypeScript <a name = "typescript"></a>

TypeScript definitions are included, so no need to install an additional `@types` library!

## Options API <a name = "options-api"></a>

### `[include]` <a name = "options-include"></a>

Type: `string[]`

Glob patterns to for module names to include.

```js
bundleImports({
  // Include files that end in `.code.js`
  include: ['**/*.code.js'],
})
```

### `[exclude]` <a name = "options-include"></a>

Type: `string[]`

Glob patterns to for module names to include.

```js
bundleImports({
  // Exclude files that end in `.code.js`
  include: ['**/*.code.js'],
  // Except for this one...
  exclude: ['src/not-me.code.js'],
})
```

### `[importAs]` <a name = "options-import-as"></a>

Type: `"path" | "code"`

Use `"code"` to bundle the module and import it as a string.

```js
bundleImports({
  importAs: 'path',
})
```

Use `"path"` to emit the module as a file and import the file path as a string. This works well for [service workers](#usage-sw), for example.

```js
bundleImports({
  importAs: 'path',
})
```

### `[options]` <a name = "options-options"></a>

Type: `string[]`

`rollup-plugin-bundle-imports` bundles the module into an IIFE, and uses the `plugins` array defined in your Rollup input options by default.

If you need to use other plugins or plugin settings for bundled imports, this is the place. You can set any of the [Rollup input options](https://rollupjs.org/guide/en/#big-list-of-options) in `options`.

The properties `options.file` and `options.output` will be ignored.

> Note that most libraries expect to be bundled into a UMD or IIFE, so using `options.format` to create an ES2015 module may cause unexpected results.

```js
bundleImports({
  options: {
    // Bundle the module as an ESM2015 module
    format: 'esm',
    // Use a different set of plugins
    plugins: [resolve(), commonjs()],
  },
})
```

### Default options

```js
// rollup.config.js

import { rollup } from 'rollup'
import bundle from 'rollup-plugin-bundle-imports'

// These are the default options
const options = {
  include: ['**/*.code.js'],
  importAs: 'code',
  // Rollup input options for the imported module
  options: {
    plugins: [resolve(), commonjs()],
    output: {
      format: 'iife',
      preferConst: true,
    },
  },
}

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle-esm.js',
    format: 'esm',
  }
  plugins: [bundleImports()],
  // This is the same as above
  plugins: [bundleImports(options)],
}
```
