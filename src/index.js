import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'

import generateCode from './generateCode'

function codeString({
  include = '**/*.code.js',
  exclude,
  plugins,
  output = {
    format: 'iife',
  },
} = {}) {
  const filter = createFilter(include, exclude)

  return {
    name: 'code-string',

    async transform(_, id) {
      if (filter(id)) {
        const bundle = await rollup({
          input: id,
          plugins,
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
      }
    },
  }
}

export default codeString
