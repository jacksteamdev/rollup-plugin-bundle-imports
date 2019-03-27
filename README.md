# rollup-plugin-code-string

Import javascript modules as strings.

## Installation

```sh
npm i rollup-plugin-code-string -D
```

## Usage

```js
import { rollup } from 'rollup'
import code from 'rollup-plugin-code-string'

rollup({
  entry: 'main.js',
  plugins: [code()]
})
```
