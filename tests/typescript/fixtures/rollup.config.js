/* eslint-env node */

import typescript from 'rollup-plugin-typescript'
import { bundleImports } from '../../../src/index'

const bundleImportSpy = bundleImports({
  useVirtualModule: true,
})

// Mock plugin hooks if in jest
if (process.env.NODE_ENV === 'test') {
  bundleImportSpy.transform = jest.fn(bundleImportSpy.transform)
  bundleImportSpy.generateBundle = jest.fn()
}

const plugins = [bundleImportSpy, typescript()]

export default {
  input: 'tests/typescript/fixtures/entry.ts',
  output: {
    file: 'tests/typescript/dest/entry-esm.js',
    format: 'esm',
    preferConst: true,
  },
  plugins,
}
