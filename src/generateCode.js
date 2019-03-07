const generateCode = (bundle, { input, output }) =>
  bundle
    .generate(output)
    .then(result =>
      result.output.find(bundle =>
        bundle.facadeModuleId.includes(input),
      ),
    )
    .then(({ code }) => code)

export default generateCode
