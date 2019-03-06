/* eslint-env node */

const plugins = []

export default [
  {
    input: 'tests/fixtures/src/background.js',
    output: [
      {
        file: 'tests/fixtures/dest/background-esm.js',
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: 'tests/fixtures/src/content.js',
    output: [
      {
        file: 'tests/fixtures/dest/content.js',
        format: 'esm',
      },
    ],
    plugins,
  },
]
