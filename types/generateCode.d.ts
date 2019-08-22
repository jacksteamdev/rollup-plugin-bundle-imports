import { RollupBuild } from 'rollup'
declare const generateCode: (
  bundle: RollupBuild,
  {
    input,
    output,
  }: {
    input: string
    output: any
  },
) => Promise<string | undefined>
export default generateCode
