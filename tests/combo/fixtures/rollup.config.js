/* eslint-env node */

import bundleImports from '../../../src/index'

const codeImport = bundleImports({
  include: ['**/injected.js'],
  importAs: 'code',
})

const pathImport = bundleImports({
  include: ['**/content.js'],
  importAs: 'path',
})

const plugins = [codeImport, pathImport]

export default {
  input: 'tests/combo/fixtures/background.js',
  output: {
    file: 'tests/combo/dest/background.js',
    format: 'iife',
    preferConst: true,
  },
  plugins,
}
