import { rollup, watch } from 'rollup'
import generateCode from '../../src/generateCode'
import config from '../fixtures/basic/rollup.test.basic.config'

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
  let watcher = null

  beforeEach(() => {
    watcher = watch(config)
  })

  afterEach(() => {
    watcher.close()
    watcher = null
  })

  test('does not error', done => {
    const spy = jest.fn()

    const expectations = () => {
      expect(spy).toBeCalledTimes(4)
    }

    watcher.on('event', spy)

    watcher.on('event', event => {
      try {
        switch (event.code) {
          case 'START':
          case 'BUNDLE_START':
          case 'BUNDLE_END':
          case 'ERROR':
            break

          case 'END':
            expectations(event)
            done()
            break

          case 'FATAL':
            throw new Error(event.code)
        }
      } catch (error) {
        done.fail(error)
      }
    })
  })

  test('runs again after file change', done => {
    const spy = jest.fn()

    const expectations = () => {}

    watcher.on('event', spy)

    watcher.on('event', event => {
      try {
        switch (event.code) {
          case 'START':
          case 'BUNDLE_START':
          case 'BUNDLE_END':
          case 'ERROR':
            break

          case 'END':
            expectations(event)
            done()
            break

          case 'FATAL':
            throw new Error(event.code)
        }
      } catch (error) {
        done.fail(error)
      }
    })
  })
})
