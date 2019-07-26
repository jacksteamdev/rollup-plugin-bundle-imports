/* eslint-env node */

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'lib/bundle-imports-esm.js',
        format: 'esm',
        sourcemap: 'inline',
      },
      {
        file: 'lib/bundle-imports-cjs.js',
        format: 'cjs',
        sourcemap: 'inline',
      },
    ],
    external: [
      'rollup-plugin-commonjs',
      'rollup-plugin-node-resolve',
      'rollup-pluginutils',
      'rollup',
      'path',
    ],
  },
]
