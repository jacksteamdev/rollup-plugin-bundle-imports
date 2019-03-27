import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import generateCode from './generateCode'

function codeString({
  include = ['**/*.code.js'],
  exclude = [],
  plugins = [resolve(), commonjs()],
  output = {
    format: 'iife',
    preferConst: true,
  },
} = {}) {
  const filter = createFilter(include, exclude)

  // Convert to arrays
  exclude = [].concat(exclude)
  include = [].concat(include)

  return {
    name: 'code-string',

    async load(id) {
      if (!filter(id)) return null

      try {
        const bundle = await rollup({
          input: id,
          // Should exclude the current module in recursive bundles
          plugins: [
            ...plugins,
            codeString({ exclude: exclude.concat(id) }),
          ],
        })

        const code = await generateCode(bundle, {
          input: id,
          output,
        })

        bundle.watchFiles.forEach(file => {
          this.addWatchFile(file)
        })

        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: '' },
        }
      } catch (error) {
        this.error(error)
      }
    },
  }
}

export default codeString
