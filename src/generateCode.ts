import { RollupBuild, OutputChunk } from 'rollup'

const generateCode = (
  bundle: RollupBuild,
  { input, output }: { input: string; output: any },
) =>
  bundle
    .generate(output)
    .then((result) =>
      result.output
        // @ts-ignore
        .filter((x): x is OutputChunk => !x.isAsset)
        .find(
          ({ facadeModuleId: id }) => id && id.includes(input),
        ),
    )
    .then((x) => x && x.code)

export default generateCode
