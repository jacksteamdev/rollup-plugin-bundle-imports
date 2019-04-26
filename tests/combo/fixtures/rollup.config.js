/* eslint-env node */

import bundleImport from '../../../src/index'

const codeImport = bundleImport({
  include: ['**/injected.js'],
  importAs: 'code',
})

const pathImport = bundleImport({
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
