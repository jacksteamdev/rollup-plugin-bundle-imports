/* eslint-env node */

import typescript from 'rollup-plugin-typescript'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index-esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'lib/index-cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    external: [
      'rollup-plugin-commonjs',
      'rollup-plugin-node-resolve',
      'rollup-pluginutils',
      'rollup',
      'path',
    ],
    plugins: [typescript()],
  },
]
