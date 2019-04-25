# rollup-plugin-bundle-import

Bundle an import separately and use the result in your code.

## Installation

```sh
npm i rollup-plugin-bundle-import -D
```

## Usage

## Bundle a service worker

`rollup.config.js`:

```js
import { rollup } from 'rollup'
import bundle from 'rollup-plugin-bundle-import'

rollup({
  entry: 'register-service-worker.js',
  plugins: [
    bundle({
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
import bundle from 'rollup-plugin-bundle-import'

rollup({
  entry: 'background.js',
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
