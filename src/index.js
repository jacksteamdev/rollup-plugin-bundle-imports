import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'
import path from 'path'

import generateCode from './generateCode'

const pluginName = 'bundle-import'
let count = 0

function bundleImport({
  include,
  exclude,
  importAs,
  options: {
    plugins,
    output = {
      format: 'esm',
      preferConst: true,
    },
  } = {},
  ...inputOptions
} = {}) {
  if (!include) {
    throw new TypeError('options.include must be defined.')
  }

  if (!importAs) {
    throw new TypeError('options.importAs must be defined.')
  }

  if (!output.format) {
    throw new TypeError('options.options.format must be defined')
  }

  const filter = createFilter(include, exclude)

  // Convert to arrays
  const _include = [].concat(include)
  const _exclude = exclude ? [].concat(exclude) : []
  let _plugins = []

  // Handle multiple plugin instances
  // TODO: Limit plugin duplication during recursion
  const name = `${pluginName}-${count}`
  count++

  return {
    name,

    options({ plugins: p }) {
      _plugins = plugins || p.filter(({ name: n }) => n !== name)
    },

    async load(id) {
      if (!filter(id)) return null

      // try {
      const bundle = await rollup({
        input: id,
        // Should exclude the current module in recursive bundles
        plugins: _plugins.concat(
          bundleImport({
            include: _include,
            exclude: _exclude.concat(id),
            importAs,
            options: {
              plugins: _plugins,
              output,
              ...inputOptions,
            },
          }),
        ),
        ...inputOptions,
      })

      bundle.watchFiles.forEach(file => {
        this.addWatchFile(file)
      })

      const code = await generateCode(bundle, {
        input: id,
        output,
      })

      switch (importAs) {
        case 'code': {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: { mappings: '' },
          }
        }

        case 'path': {
          const assetId = this.emitAsset(path.basename(id), code)

          return {
            code: `export default import.meta.ROLLUP_ASSET_URL_${assetId}`,
            map: { mappings: '' },
          }
        }

        default: {
          throw new TypeError(
            `Unknown options.importAs: '${importAs}'`,
          )
        }
      }
      // } catch (error) {
      //   this.error(error)
      // }
    },
  }
}

export default bundleImport
