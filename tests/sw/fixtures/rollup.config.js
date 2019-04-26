/* eslint-env node */

import bundleImport from '../../../src/index'

const bundleImportSpy = bundleImport({
  include: ['**/*sw.js'],
  importAs: 'path',
})

// Mock plugin hooks if in jest
if (process.env.NODE_ENV === 'test') {
  bundleImportSpy.transform = jest.fn(bundleImportSpy.transform)
  bundleImportSpy.generateBundle = jest.fn()
}

const plugins = [bundleImportSpy]

export default {
  input: 'tests/sw/fixtures/index.js',
  output: {
    file: 'tests/sw/dest/index-esm.js',
    format: 'esm',
    preferConst: true,
  },
  plugins,
}
