/* eslint-env node */

import bundleImport from '../../../src/index'

const bundleImportSpy = bundleImport({
  include: ['**/*.code.js'],
  importAs: 'code',
})

// Mock plugin hooks if in jest
if (process.env.NODE_ENV === 'test') {
  bundleImportSpy.transform = jest.fn(bundleImportSpy.transform)
  bundleImportSpy.generateBundle = jest.fn()
}

const plugins = [bundleImportSpy]

export default {
  input: 'tests/advanced/fixtures/background.js',
  output: {
    file: 'tests/advanced/dest/background.js',
    format: 'iife',
    preferConst: true,
  },
  plugins,
}
