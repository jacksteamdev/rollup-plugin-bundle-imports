/* eslint-env node */

import { bundleImports } from '../../../src/index'

const codeImport = bundleImports({
  include: ['**/*.code.js'],
  importAs: 'code',
})

const pathImport = bundleImports({
  include: ['**/*.asset.js'],
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
