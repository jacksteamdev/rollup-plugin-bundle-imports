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

  const { output } = await bundle.generate(config)
  const chunk = output.find(({ code }) => {
    return code
  })

  const asset = output.find(({ isAsset }) => {
    return isAsset
  })

  expect(output.length).toBe(2)
  expect(chunk.code).toContain(
    'navigator.serviceWorker.register(sw)',
  )
  expect(asset.source).toContain('const b')
  expect(asset.source).toContain('console.log(\'c\')')
})

test('sw config watch', done => {
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

test.todo('sw config watch with changes')

// test('sw config watch with changes', done => {
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
