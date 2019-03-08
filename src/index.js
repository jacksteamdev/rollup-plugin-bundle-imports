import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import generateCode from './generateCode'

function codeString({
  include = ['**/*.code.js'],
  exclude,
  plugins = [resolve(), commonjs()],
  output = {
    format: 'iife',
    preferConst: true,
    exports: 'none',
  },
} = {}) {
  const filter = createFilter(include, exclude)
  const cache = {}

  return {
    name: 'code-string',

    // Try the load hook instead
    // https://rollupjs.org/guide/en#load
    async load(id) {
      if (!filter(id)) return null

      if (!plugins.some(({ name }) => name === 'code-string')) {
        // Exclude this module from being reprocessed
        plugins = [...plugins, codeString({ exclude: id })]
      } else {
        plugins = plugins.map(plugin => {
          if (plugin.name === 'code-string') {
            // Need to exclude different id
            return codeString({ exclude: id })
          } else {
            return plugin
          }
        })
      }

      if (cache[id]) {
        const code = `export default ${JSON.stringify(
          cache[id],
        )};`

        delete cache[id]

        return {
          code,
          map: { mappings: '' },
        }
      }

      try {
        const bundle = await rollup({
          input: id,
          plugins: plugins,
        })

        const code = await generateCode(bundle, {
          input: id,
          output,
        })

        cache[id] = code

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
