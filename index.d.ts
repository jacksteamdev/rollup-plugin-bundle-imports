interface RollupPluginBundleImports {
  name: string
  options(inputOptions: any): void
  load(id: string): Promise<void>
}

export function bundleImports(options?: {
  include: string[]
  exclude: string[]
  importAs: 'code' | 'path'
  options: {
    plugins: any[]
    output: {
      format: string
      preferConst: boolean
      [prop: string]: any
    }
    [prop: string]: any
  }
}): RollupPluginChromeExtension
