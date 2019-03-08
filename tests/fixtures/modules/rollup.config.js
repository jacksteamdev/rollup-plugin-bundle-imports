/* eslint-env node */

import codeString from '../../../src/index'

const codeStringSpy = codeString()

// Mock plugin hooks if in jest
if (process.env.NODE_ENV === 'test') {
  codeStringSpy.transform = jest.fn(codeStringSpy.transform)
  codeStringSpy.generateBundle = jest.fn()
}

const plugins = [codeStringSpy]

export default {
  input: 'tests/fixtures/modules/background.js',
  output: {
    file: 'tests/fixtures/dest/background.js',
    format: 'iife',
    preferConst: true,
  },
  plugins,
}
