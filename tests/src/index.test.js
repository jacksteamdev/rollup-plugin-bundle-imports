import { rollup, watch } from 'rollup'
import generateCode from '../../src/generateCode'
import config from '../rollup.test.config'

describe('build', () => {
  test('returns a string', async () => {
    const bundle = await rollup(config)

    const code = await generateCode(bundle, config)

    expect(typeof code).toBe('string')
  })

  test('bundles all imports', async () => {
    const bundle = await rollup(config)

    const code = await generateCode(bundle, config)

    expect(code).toContain('const add')
    expect(code).toContain('const b')
    expect(code).toContain('console.log(\'c\')')
    expect(code).toContain('const codeAsString')
  })
})

describe('watch', () => {
  test.only('successfully builds', done => {
    const watcher = watch(config)
    const spy = jest.fn()

    const expectations = event => {
      if (event.code === 'END') {
        watcher.close()
        done()
      }
    }

    watcher.on('event', spy)
    watcher.on('event', event => {
      switch (event.code) {
        case 'START':
        case 'BUNDLE_START':
        case 'BUNDLE_END':
          return
        case 'END':
          return expectations(event)
        case 'ERROR':
        case 'FATAL':
          throw new Error(event.code)
      }
    })
  })
})
