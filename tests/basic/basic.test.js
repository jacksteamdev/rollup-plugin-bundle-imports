import { rollup, watch } from 'rollup'
import generateCode from '../../src/generateCode'
import config from './fixtures/rollup.config'

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

test('basic config watch', done => {
  const spy = jest.fn()

  const expects = () => {
    // Expect watcher not to error
    expect(
      spy.mock.calls.some(([{ code }]) => code === 'ERROR'),
    ).toBeFalsy()
    expect(
      spy.mock.calls.some(([{ code }]) => code === 'FATAL'),
    ).toBeFalsy()

    // Expect correct events to fire
    expect(spy).toBeCalledWith({ code: 'START' })
    expect(spy).toBeCalledWith({ code: 'END' })
    expect(
      spy.mock.calls.some(
        ([{ code }]) => code === 'BUNDLE_START',
      ),
    ).toBeTruthy()
    expect(
      spy.mock.calls.some(([{ code }]) => code === 'BUNDLE_END'),
    ).toBeTruthy()

    // Expect correct amount of activity
    expect(spy).toBeCalledTimes(4)
  }

  setupWatcher({ expects, config, done, spy })
})

test.todo('basic config watch with changes')

// test('basic config watch with changes', done => {
//   const spy = jest.fn()

//   const expects = () => {
//     // Test that the watcher fires after file changes
//     throw new Error('no tests written')
//   }

//   setupWatcher({ expects, config, done, spy })
// })

function setupWatcher({ expects, config, done, spy }) {
  const watcher = watch(config)

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
          expects(event)
          watcher.close()
          done()
          break

        case 'FATAL':
          throw new Error(event.code)
      }
    } catch (error) {
      watcher.close()
      done.fail(error)
    }
  })
}
