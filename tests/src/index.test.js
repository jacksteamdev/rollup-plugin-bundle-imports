import { rollup } from 'rollup'
import generateCode from '../../src/generateCode'
import config from '../rollup.config'

describe('build', () => {
  test('imports a file', async () => {
    const bundle = await rollup(config)

    const code = await generateCode(bundle, config)

    expect(code).toBeDefined()
  })
})
