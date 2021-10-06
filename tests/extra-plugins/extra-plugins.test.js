jest.mock('rollup', () => {
  const generate = jest.fn(async () => ({ output: [] }))
  const write = jest.fn(async () => ({ output: [] }))

  const rollup = jest.fn(async () => ({
    cache: {},
    generate,
    watchFiles: [],
    write,
  }))

  return {
    generate,
    write,
    rollup,
  }
})

import { rollup } from 'rollup'
import {
  config,
  plugins,
  plugin,
} from './fixtures/rollup.config'

import cjs from '@rollup/plugin-commonjs'
import res from '@rollup/plugin-node-resolve'

const commonjs = cjs()
const resolve = res()

test('adds resolve and commonjs', async () => {
  config.plugins = [...plugins]

  plugin.options(config)
  await plugin.load('code string.js')

  expect(rollup).toBeCalledTimes(1)

  const innerConfig = rollup.mock.calls[0][0]

  const _commonjs = innerConfig.plugins.filter(
    ({ name }) => name === commonjs.name,
  )
  const _resolve = innerConfig.plugins.filter(
    ({ name }) => name === resolve.name,
  )

  expect(_commonjs.length).toBe(1)
  expect(_resolve.length).toBe(1)
})

test('adds commonjs', async () => {
  config.plugins = [...plugins, resolve]

  plugin.options(config)
  await plugin.load('code string.js')

  expect(rollup).toBeCalledTimes(1)

  const innerConfig = rollup.mock.calls[0][0]

  const _commonjs = innerConfig.plugins.filter(
    ({ name }) => name === commonjs.name,
  )
  const _resolve = innerConfig.plugins.filter(
    ({ name }) => name === resolve.name,
  )

  expect(_commonjs.length).toBe(1)
  expect(_resolve.length).toBe(1)

  expect(_resolve[0]).toBe(resolve)
  expect(_commonjs[0]).not.toBe(commonjs)
})

test('adds resolve', async () => {
  config.plugins = [...plugins, commonjs]

  plugin.options(config)
  await plugin.load('code string.js')

  expect(rollup).toBeCalledTimes(1)

  const innerConfig = rollup.mock.calls[0][0]

  const _commonjs = innerConfig.plugins.filter(
    ({ name }) => name === commonjs.name,
  )
  const _resolve = innerConfig.plugins.filter(
    ({ name }) => name === resolve.name,
  )

  expect(_commonjs.length).toBe(1)
  expect(_resolve.length).toBe(1)

  expect(_resolve[0]).not.toBe(resolve)
  expect(_commonjs[0]).toBe(commonjs)
})

test('does not add plugins', async () => {
  config.plugins = [...plugins, commonjs, resolve]

  plugin.options(config)
  await plugin.load('code string.js')

  expect(rollup).toBeCalledTimes(1)

  const innerConfig = rollup.mock.calls[0][0]

  const _commonjs = innerConfig.plugins.filter(
    ({ name }) => name === commonjs.name,
  )
  const _resolve = innerConfig.plugins.filter(
    ({ name }) => name === resolve.name,
  )

  expect(_commonjs.length).toBe(1)
  expect(_resolve.length).toBe(1)

  expect(_resolve[0]).toBe(resolve)
  expect(_commonjs[0]).toBe(commonjs)
})
