/* eslint-env node */

import { bundleImports } from '../../../src/index'

const codeImport = bundleImports({
  include: ['**/*-code.js'],
  importAs: 'code',
  options: { plugins: [] },
})

const pathImport = bundleImports({
  include: ['**/*-asset.js'],
  importAs: 'path',
  options: { plugins: [] },
})

const plugins = [codeImport, pathImport]

export default {
  input: 'tests/combo-with-plugins/fixtures/background.js',
  output: {
    file: 'tests/combo-with-plugins/dest/background.js',
    format: 'iife',
    preferConst: true,
  },
  plugins,
}
