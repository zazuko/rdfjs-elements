/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path'
import { defineConfig, mergeConfig } from 'vite'
import config from '../../vite.config.js'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default mergeConfig(
  config,
  defineConfig({
    build: {
      outDir: path.resolve(__dirname, '../../dist/converter'),
    },
  })
)
