/* eslint-env node */

import { bundleImports } from '../../../src/index'

const bundleImportSpy = bundleImports({
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
  input: 'tests/basic/fixtures/entry.js',
  output: {
    file: 'tests/basic/dest/entry-esm.js',
    format: 'esm',
    preferConst: true,
  },
  plugins,
}
