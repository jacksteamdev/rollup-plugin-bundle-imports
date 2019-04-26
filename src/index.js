import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'
import path from 'path'

import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import generateCode from './generateCode'

const pluginName = 'bundle-import'
const pluginCache = new Map()

function bundleImports(
  {
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
  } = {
    include: ['**/*.code.js'],
    importAs: 'code',
    options: {
      plugins: [resolve(), commonjs()],
      output: {
        format: 'iife',
        preferConst: true,
      },
    },
  },
) {
  const _id = JSON.stringify({
    include,
    exclude,
    importAs,
    plugins,
    output,
    inputOptions,
  })

  if (pluginCache.has(_id)) {
    return pluginCache.get(_id)
  }

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
  const name = `${pluginName}-${pluginCache.size}`

  const pluginInstance = {
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
          bundleImports({
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

  pluginCache.set(_id, pluginInstance)

  return pluginInstance
}

export default bundleImports
