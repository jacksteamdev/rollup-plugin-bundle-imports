/* eslint-env node */

import bundleImport from '../../../src/index'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const bundleImportSpy = bundleImport({
  include: ['**/*.code.js'],
  importAs: 'code',
})

// Mock plugin hooks if in jest
if (process.env.NODE_ENV === 'test') {
  bundleImportSpy.transform = jest.fn(bundleImportSpy.transform)
  bundleImportSpy.generateBundle = jest.fn()
}

const plugins = [resolve(), commonjs(), bundleImportSpy]

export default {
  input: 'tests/modules/fixtures/background.js',
  output: {
    file: 'tests/modules/dest/background.js',
    format: 'iife',
    preferConst: true,
  },
  plugins,
}
