import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import {
  Plugin,
  rollup,
  RollupOptions,
  SourceDescription,
} from 'rollup'
import { createFilter } from 'rollup-pluginutils'
import generateCode from './generateCode'

interface BundleImportOptions {
  include?: string[]
  exclude?: string[]
  importAs?: string
  options: {
    plugins: Plugin[]
    output: {
      format: string
      preferConst: boolean
      [prop: string]: any
    }
    [prop: string]: any
  }
  useVirtualModule: boolean
}

const regex = /^(code|path) /
const pluginName = 'bundle-import'
const pluginCache = new Map()

export default bundleImports
export function bundleImports(
  options?: BundleImportOptions,
): Plugin
export function bundleImports({
  include = ['**/*.code.js', '**/*.code.ts'],
  exclude = [] as string[],
  importAs = 'code',
  options: {
    plugins = [] as Plugin[],
    output = {
      format: 'iife',
      preferConst: true,
    },
    ...inputOptions
  } = {},
  useVirtualModule = false,
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

  if (!useVirtualModule) {
    if (!include) {
      throw new TypeError('options.include must be defined.')
    }

    if (!importAs) {
      throw new TypeError('options.importAs must be defined.')
    }

    if (!output) {
      throw new TypeError(
        'options.options.output must be defined',
      )
    }

    if (!output.format) {
      throw new TypeError(
        'options.options.format must be defined',
      )
    }
  }

  // if (importAs === 'path' && output.format !== 'esm') {
  //   throw new Error(
  //     'importing a bundle as a path is only compatible with esm format',
  //   )
  // }

  const filter = createFilter(include, exclude)

  // Convert to arrays
  const _include = ([] as string[]).concat(include)
  const _exclude = exclude
    ? ([] as string[]).concat(exclude)
    : ([] as string[])
  let _plugins: Plugin[] = []

  // Handle multiple plugin instances
  // TODO: Limit plugin duplication during recursion
  // TODO: use nanoid to differentiate between plugins
  const name = `${pluginName}-${pluginCache.size}`

  const pluginInstance: Plugin = {
    name,

    options({ plugins: p = [] }: RollupOptions) {
      // console.log('🚀: options')

      // Remove self from plugin array
      const _p = p
        .filter((p): p is Plugin => !!p && typeof p === 'object')
        .filter(({ name: n }) => n !== name)
        .filter(({ name: n }) => n !== 'chrome-extension')

      const _commonjs =
        !_p.some(({ name }) => name === 'commonjs') && commonjs()
      const _resolve =
        !_p.some(({ name }) => name === 'node-resolve') &&
        resolve()

      _plugins = [_resolve, _commonjs, ..._p].filter(
        (x): x is Plugin => !!x,
      )

      return undefined
    },

    resolveId(importee, importer) {
      if (importer && regex.test(importee)) {
        const importAs = importee.startsWith('code')
          ? 'code'
          : 'path'

        const filename = importee.replace(regex, '')
        const dirname = path.dirname(importer)
        const pathname = path.resolve(dirname, filename)

        // TODO: calculate absolute file path
        return `${importAs} ${pathname}`
      } else {
        return null
      }
    },

    async load(id) {
      if (useVirtualModule) {
        if (!id.startsWith('code ') && !id.startsWith('path '))
          return null

        // console.log('🚀: load')
        // console.log('🚀: id', id)

        const input = id.replace(regex, '')
        const importAs = id.startsWith('code') ? 'code' : 'path'

        const config = {
          input,
          // Should exclude the current module in recursive bundles
          plugins: _plugins.concat(
            bundleImports({
              options: {
                plugins: _plugins,
                ...inputOptions,
                output,
              },
              useVirtualModule,
            }),
          ),
          ...inputOptions,
        }

        // console.log('🚀: config', config)
        const bundle = await rollup(config)
        // console.log('🚀: post-bundle')

        bundle.watchFiles.forEach((file) => {
          this.addWatchFile(file)
        })

        // console.log('🚀: pre-generateCode', {
        // input,
        // output,
        // })

        const code = await generateCode(bundle, {
          input,
          // @ts-ignore
          output,
        })

        // console.log('🚀: post-generateCode')

        if (importAs === 'code') {
          return {
            code: `export const code = ${JSON.stringify(code)};`,
            map: { mappings: '' },
          } as SourceDescription
        } else {
          const assetId = this.emitFile({
            type: 'asset',
            name: path.basename(id),
            source: code,
          })

          return {
            code: `export default import.meta.ROLLUP_FILE_URL_${assetId}`,
            map: { mappings: '' },
          } as SourceDescription
        }
      } else {
        if (!filter(id)) return null

        const config = {
          include: _include,
          exclude: _exclude.concat(id),
          importAs,
          options: {
            plugins: _plugins,
            ...inputOptions,
            output,
          },
          useVirtualModule,
        }

        const bundle = await rollup({
          input: id,
          // Should exclude the current module in recursive bundles
          plugins: _plugins.concat(bundleImports(config)),
          ...inputOptions,
        })

        bundle.watchFiles.forEach((file) => {
          this.addWatchFile(file)
        })

        const code = await generateCode(bundle, {
          input: id,
          // @ts-ignore
          output,
        })

        switch (importAs) {
          case 'code': {
            return {
              code: `export default ${JSON.stringify(code)};`,
              map: null,
            }
          }

          case 'path': {
            const assetId = this.emitFile({
              type: 'asset',
              name: path.basename(id),
              source: code,
            })

            return {
              code: `export default import.meta.ROLLUP_FILE_URL_${assetId}`,
              map: null,
            }
          }

          default: {
            throw new TypeError(
              `Unknown options.importAs: '${importAs}'`,
            )
          }
        }
      }
    },
  }

  pluginCache.set(_id, pluginInstance)

  return pluginInstance
}
