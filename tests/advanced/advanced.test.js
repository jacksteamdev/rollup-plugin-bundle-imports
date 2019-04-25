import { rollup } from 'rollup'
import generateCode from '../../src/generateCode'
import config from './fixtures/rollup.config'

test('works recursively', async () => {
  const bundle = await rollup(config)

  const code = await generateCode(bundle, config)

  expect(code).toContain('chrome.tabs')
  expect(code).toContain('document.head')
  expect(code).toContain('XMLHttpRequest')
})


