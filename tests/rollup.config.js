/* eslint-env node */

import codeString from '../src/index'

const plugins = [codeString()]

export default [
  {
    input: 'tests/fixtures/src/entry.js',
    output: [
      {
        file: 'tests/fixtures/dest/entry-esm.js',
        format: 'esm',
      },
    ],
    plugins,
  },
]
