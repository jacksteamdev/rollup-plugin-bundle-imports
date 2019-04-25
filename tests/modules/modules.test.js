import { rollup } from 'rollup'
import generateCode from '../../src/generateCode'
import config from './fixtures/rollup.config'

test('works with multiple imports', async () => {
  const bundle = await rollup(config)

  const code = await generateCode(bundle, config)

  // from background.js
  expect(code).toContain('chrome.tabs')
  // from content.code.js
  expect(code).toContain('document.head')
  // from inject.code.js
  expect(code).toContain('XMLHttpRequest')
  // from dedupe library
  expect(code).toContain('clone.push(elem)')
})
