# @rdfjs-elements/testing

A package which helps build native, build-less tests which run on [es-dev-server](https://npm.im/es-dev-server). For example when using the setup as recommended by [`@open-wc/testing-karma`](https://npm.im/@open-wc/testing-karma).

It provides stubs for some commonly used packages which require `stream` or `readable-stream` and are thus unsuitable for testing scenarios which only run on native ES modules or have limited commonjs support.

Stubbed out modules:

* `@rdf-esm/formats-common`
* `into-stream`
* `string-to-stream`

## Setup with `@open-wc/testing-karma`

You need to add a result transformer to the `karma-esm` section of the configuration file.

```js
const fakeStreamModules = require('@rdfjs-elements/testing')

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      esm: {
        responseTransformers: [
          fakeStreamModules()
        ]
      },
    })
  )
  return config
}
```

## Mocking `formats-common`

In your test, import the mocked `parsers` or `serializers` and preset them with a single-use result. It will be discarded the first time it the mocked format is imported.

```js
import { parsers } from '@rdfjs-elements/testing-helpers'
import { dataset } from '@rdf-esm/dataset'

describe('my code', () => {
  it(`can parse without "native" streams`, () => {
    const parsed = dataset()
    parsers.set('text/turtle', parsed)
    
    const result = parsers.import('text/turtle')
    
    expect(result).to.deep.equal(parsed)
  })
})
```
