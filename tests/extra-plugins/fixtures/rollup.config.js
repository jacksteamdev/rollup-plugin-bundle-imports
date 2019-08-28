/* eslint-env node */

import typescript from 'rollup-plugin-typescript'
import { bundleImports } from '../../../src/index'

export const plugin = bundleImports({
  useVirtualModule: true,
})

export const plugins = [plugin, typescript()]

export const config = {
  input: 'tests/typescript/fixtures/entry.ts',
  output: {
    file: 'tests/typescript/dest/entry-esm.js',
    format: 'esm',
    preferConst: true,
  },
  plugins: [...plugins],
}
