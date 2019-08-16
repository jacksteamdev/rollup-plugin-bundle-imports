import { createFilter } from 'rollup-pluginutils'
import { rollup } from 'rollup'
import path from 'path'

import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import generateCode from './generateCode'

const pluginName = 'bundle-import'
const pluginCache = new Map()

export default bundleImports
export function bundleImports({
  include = ['**/*.code.js', '**/*.code.ts'],
  exclude,
  importAs = 'code',
  options: {
    plugins = [resolve(), commonjs()],
    output = {
      format: 'iife',
      preferConst: true,
    },
    ...inputOptions
  } = {},
} = {}) {
  const _id = JSON.stringify({
    include,
    exclude,
    importAs,
    plugins,
    inputOptions,
    output,
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

  if (!output) {
    throw new TypeError('options.options.output must be defined')
  }

  if (!output.format) {
    throw new TypeError('options.options.format must be defined')
  }

  // if (importAs === 'path' && output.format !== 'esm') {
  //   throw new Error(
  //     'importing a bundle as a path is only compatible with esm format',
  //   )
  // }

  const filter = createFilter(include, exclude)

  // Convert to arrays
  const _include = [].concat(include)
  const _exclude = exclude ? [].concat(exclude) : []
  let _plugins = []

  // Handle multiple plugin instances
  // TODO: Limit plugin duplication during recursion
  // TODO: use nanoid to differentiate between plugins
  const name = `${pluginName}-${pluginCache.size}`

  const pluginInstance = {
    name,

    options({ plugins: p }) {
      const _p = p
        // TODO: test does not crash when plugins array includes falsy values
        .filter((p) => typeof p === 'object')
        .filter(({ name: n }) => n !== name)

      _plugins = plugins
        ? plugins.concat(
            // Include other bundleImports instances
            _p.filter(({ name: n }) => n.startsWith(pluginName)),
          )
        : _p
    },

    async load(id) {
      if (!filter(id)) return null

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
              ...inputOptions,
              output,
            },
          }),
        ),
        ...inputOptions,
      })

      bundle.watchFiles.forEach((file) => {
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
    },
  }

  pluginCache.set(_id, pluginInstance)

  return pluginInstance
}
