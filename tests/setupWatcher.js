import { watch } from 'rollup'

export function setupWatcher({ expects, config, done, spy }) {
  const watcher = watch(config)

  watcher.on('event', spy)
  watcher.on('event', (event) => {
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
