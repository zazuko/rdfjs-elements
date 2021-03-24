/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma')
const merge = require('deepmerge')
const fakeStreamModules = require('@rdfjs-elements/testing')
const cjsTransformer = require('es-dev-commonjs-transformer')

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep ? config.grep : 'packages/*/test/**/*.test.js',
          type: 'module',
        },
      ],

      esm: {
        nodeResolve: true,
        responseTransformers: [
          fakeStreamModules(),
          function fakeNodeModules(context) {
            if (context.url.match(/SparqlParser\.js/)) {
              // For the love of Tim BL, I have no idea how to set up rollup to handle this module
              // There that one line which import built-in node modules and it fails to transform
              return {
                body: context.body.replace(/require\('fs'\).+/, "''"),
              }
            }
            return context
          },
          cjsTransformer([
            '**/node_modules/@open-wc/**/*',
            '**/node_modules/chai/**/*',
            '**/node_modules/chai-dom/**/*',
            '**/node_modules/sinon-chai/**/*',
          ]),
        ],
        coverageExclude: [
          'packages/rdf-editor/src/mode/*.js',
          'packages/sparql-editor/src/mode/*.js',
        ],
      },
      // you can overwrite/extend the config further
    })
  )
  return config
}
