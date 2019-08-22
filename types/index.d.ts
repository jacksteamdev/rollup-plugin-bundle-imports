import { Plugin } from 'rollup'
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
}
export default bundleImports
export declare function bundleImports(
  options?: BundleImportOptions,
): Plugin
