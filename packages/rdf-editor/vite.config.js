/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path'
import { defineConfig, mergeConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import config from '../../vite.config.js'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default mergeConfig(
  config,
  defineConfig({
    base: '/rdfjs-elements/rdf-editor/',
    root: path.resolve(__dirname, 'demo'),
    build: {
      outDir: path.resolve(__dirname, '../../dist/rdf-editor'),
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '../custom-elements.json',
            dest: '.',
          },
        ],
      }),
    ],
  })
)
