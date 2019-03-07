import { rollup } from 'rollup'
import generateCode from '../../src/generateCode'

test('generateCode', async () => {
  const input = 'tests/fixtures/src/message.js'
  const output = { format: 'esm' }

  const bundle = await rollup({ input })
  const result = await generateCode(bundle, { output, input })

  expect(typeof result).toBe('string')
  expect(result).toContain('const b')
})
