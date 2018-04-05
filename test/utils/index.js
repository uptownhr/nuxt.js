import path from 'path'
import fs from 'fs'

import _getPort from 'get-port'
import { defaultsDeep } from 'lodash'
import _rp from 'request-promise-native'
import esm from 'esm'
import pkg from '../../package.json'
import Dist from '../../lib/nuxt'

export const rp = _rp
export const getPort = _getPort
export const version = pkg.version

export const Nuxt = Dist.Nuxt
export const Utils = Dist.Utils
export const Options = Dist.Options
export const Builder = Dist.Builder
export const Generator = Dist.Generator

const requireModule = esm(module, {})

export const loadFixture = function loadFixture(fixture, overrides) {
  const rootDir = path.resolve(__dirname, '../fixtures/' + fixture)
  const configFile = path.resolve(rootDir, 'nuxt.config.js')

  const config = fs.existsSync(configFile) ? requireModule(configFile).default : {}

  config.rootDir = rootDir
  config.dev = false

  return defaultsDeep({}, overrides, config)
}
