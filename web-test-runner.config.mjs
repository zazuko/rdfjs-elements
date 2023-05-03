import { esbuildPlugin } from '@web/dev-server-esbuild';
import rdfjs from 'rdfjs-eds-plugin'
import { fromRollup } from '@web/dev-server-rollup'
import commonjs from '@rollup/plugin-commonjs'
import fakeStreamModules from '@rdfjs-elements/testing'

const config = {
  files: [
    "packages/rdf-editor/**/*.test.js",
    "packages/rdf-snippet/**/*.test.js",
    "packages/sparql-editor/**/*.test.js",
    "packages/lit-helpers/**/*.test.js"
  ],
  nodeResolve: true,
  concurrency: 1,
  plugins: [
    esbuildPlugin({ target: 'auto' }),
    rdfjs,
    fakeStreamModules(),
    fromRollup(commonjs)({
      exclude: [
        '**/node_modules/@open-wc/**/*',
        '**/node_modules/chai/**/*',
        '**/node_modules/chai-dom/**/*',
        '**/node_modules/sinon-chai/**/*',
      ]
    }),
  ],
  coverage: true,
  coverageConfig: {
    exclude: [
      'node_modules/**',
      'packages/rdf-editor/src/mode/*.js',
      'packages/sparql-editor/src/mode/*.js',
      'packages/testing-helpers/**',
    ]
  }
};

export default config
