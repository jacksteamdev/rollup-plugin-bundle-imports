# rollup-plugin-bundle-imports

Bundle imports separately and use the result as [a file path](https://github.com/bumble-org/rollup-plugin-bundle-imports#bundle-a-service-worker) or [a string of code](https://github.com/bumble-org/rollup-plugin-bundle-imports#bundle-a-web-extension-content-script). Tested to work [recursively](https://github.com/bumble-org/rollup-plugin-bundle-imports#recursive-usage) or as multiple plugins with different options.

If you are coming here from [`rollup-plugin-code-string`](https://www.npmjs.com/package/rollup-plugin-code-string), the API has become more robust, [but the defaults will work the same!](https://github.com/bumble-org/rollup-plugin-bundle-imports#default-settings)

# Installation

```sh
npm i rollup-plugin-bundle-imports -D
```

# Usage

## Bundle a service worker

`rollup.config.js`:

```js
import { rollup } from 'rollup'
import bundleImports from 'rollup-plugin-bundle-imports'

rollup({
  input: 'register-service-worker.js',
  plugins: [
    bundleImports({
      include: ['**/my-sw.js'],
      // Import as path to bundle
      importAs: 'path',
    }),
  ],
})
```

`register-service-worker.js`:

```js
import sw from './my-sw.js'

navigator.serviceWorker.register(sw)
```

## Bundle a Web Extension content script

Bundle a content script to a code string to inject from the background page of a Web or Chrome Extension.

`rollup.config.js`

```js
import { rollup } from 'rollup'
import bundle from 'rollup-plugin-bundle-imports'

rollup({
  input: 'background.js',
  plugins: [
    bundle({
      include: ['**/content.js', '**/inject.js'],
      // Import as code string to bundle
      importAs: 'code',
    }),
  ],
})
```

`background.js`

```js
import code from './content.js'

// Inject the bundled code to the active tab
browser.tabs.executeScript({ code })
```

## Recursive Usage

Inject the bundled code from the content script of the previous example into the page runtime through a script tag.

`content.js`

```js
import code from './inject.js'

const script = document.createElement('script')
script.text = code

document.head.append(script)
script.remove()
```

# Default Settings

```js
import { rollup } from 'rollup'
import bundle from 'rollup-plugin-bundle-imports'

rollup({
  input: 'background.js',
  plugins: [bundle()],
})

// This is the same as using the defaults
rollup({
  input: 'background.js',
  plugins: [
    bundle({
      include: ['**/*.code.js'],
      importAs: 'code',
      options: {
        plugins: [resolve(), commonjs()],
        output: {
          format: 'iife',
          preferConst: true,
        },
      },
    }),
  ],
})
```
