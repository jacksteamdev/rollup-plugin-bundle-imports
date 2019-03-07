import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'

function codeString({
  include = '**/*.code.js',
  exclude,
  plugins,
} = {}) {
  const filter = createFilter(include, exclude)

  return {
    name: 'code-string',

    async transform(_, id) {
      console.log('transform')

      if (filter(id)) {
        const bundle = await rollup({
          input: id,
          plugins,
        })

        const { output } = await bundle.generate({
          format: 'iife',
        })

        const { code } = output.find(
          ({ facadeModuleId }) => id === facadeModuleId,
        )

        bundle.watchFiles.forEach(file => {
          // console.log(file)
          this.addWatchFile(file)
        })

        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: '' },
        }
      }
    },

    generateBundle(options, bundle) {
      console.log('generateBundle')
    },
  }
}

export default codeString
