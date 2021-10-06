import {
  NormalizedOutputOptions,
  OutputChunk,
  RollupBuild,
} from 'rollup'

const generateCode = (
  bundle: RollupBuild,
  {
    input,
    output: { plugins: p = [], ...output },
  }: { input: string } & {
    output: NormalizedOutputOptions
  },
) => {
  const plugins = p.filter(
    ({ name }) => !name.startsWith('bundle-import'),
  )

  return bundle
    .generate({ ...output, plugins })
    .then((result) =>
      result.output
        .filter((x): x is OutputChunk => x.type === 'chunk')
        .find(
          ({ facadeModuleId: id }) => id && id.includes(input),
        ),
    )
    .then((x) => x && x.code)
}

export default generateCode
