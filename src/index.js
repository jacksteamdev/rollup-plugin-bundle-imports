import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'

import generateCode from './generateCode'

function codeString({
  include = '**/*.code.js',
  exclude,
  plugins = [],
  output = {
    format: 'iife',
    // exports: 'none'
  },
} = {}) {
  const filter = createFilter(include, exclude)

  return {
    name: 'code-string',

    // Try the load hook instead
    // https://rollupjs.org/guide/en#load
    async transform(_, id) {
      if (!filter(id)) return null

      try {
        const bundle = await rollup({
          input: id,
          plugins: plugins,
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
        console.error(error)
      }
    },
  }
}

export default codeString
