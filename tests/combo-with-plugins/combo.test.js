import { rollup } from 'rollup'
import config from './fixtures/rollup.config'

test('works with both types of imports', async () => {
  const bundle = await rollup(config)

  const { output } = await bundle.generate(config.output)

  const chunk = output.find(({ code }) => {
    return code
  })

  const asset = output.find(({ type }) => {
    return type === 'asset'
  })

  expect(output.length).toBe(2)
  expect(chunk.code).toContain('chrome.tabs')
  expect(asset.source).toContain('document.head')
  expect(asset.source).toContain('XMLHttpRequest')
})
