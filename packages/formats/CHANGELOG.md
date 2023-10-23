# @rdfjs-elements/formats-pretty

## 0.6.4

### Patch Changes

- c8f0724: Preserve line breaks when serialising Turtle and Trig (fixes #139)
- 80cf005: Improves the exported type of default export

## 0.6.3

### Patch Changes

- 55e0590: Remove that postinstall script after all

## 0.6.2

### Patch Changes

- 0e8db35: Using `npx` to run postinstall script

## 0.6.1

### Patch Changes

- def9930: Fix postinstall script which should run only in dev env

## 0.6.0

### Minor Changes

- 90ebc06: Rename the named export `formats` to `mediaTypes`
- 90ebc06: The package is now ESM-only
- 90ebc06: Removed exports of instances of sinks. Instead, classes are exported. For example

  ```diff
  -import { jsonld } from '@rdfjs-elements/formats-pretty'
  +import { JsonLdSerializer } from '@rdfjs-elements/formats-pretty'
  +
  +const jsonld = new JsonLdSerializer()
  ```

- 90ebc06: Instead of exporting `parsers` and `serializers`, default-exports a `Formats` object

### Patch Changes

- 90ebc06: Update to ESM-only dependencies

## 0.5.2

### Patch Changes

- 4161f0b: List where some of their nodes are reused failed to serialize (fixes #15)
- ffbbcba: Updated graphy packages to `v4.3.4`

## 0.5.1

### Patch Changes

- fbd5755: Update `@tpluscode/rdf-ns-builders` to v2

## 0.5.0

### Minor Changes

- 18dccf6: By default, RDF Lists will always be serialized in shorthand syntax, even if the intermediate nodes have additional properties.

  To preserve any additional properties, use `preserveListNodeProperties` option of the sinks' `import` method

  ```js
  sink.import(graph, { preserveListNodeProperties: true })
  ```

## 0.4.3

### Patch Changes

- 0c89baf: Explicit `rdf:type rdf:List` would prevent shorthand list syntax
- 965c98a: Shared RDF List nodes would fail to serialize to turtle (re blake-regalia/graphy.js#54)
- 2de691c: Number would fail RDF/XML serialization (fixes #87)

## 0.4.2

### Patch Changes

- 005847c: Export serializer sink factories with option to set default prefixes

## 0.4.1

### Patch Changes

- 568d00e: Incorrect exports field prevented importing in node (`ERR_PACKAGE_PATH_NOT_EXPORTED`)

## 0.4.0

### Minor Changes

- e31f1ac: Update JSON-LD serializer. It is a potential breaking change for caller doing framing

## 0.3.4

### Patch Changes

- 5f52d07: Do not pass `undefined` to graphy parser

  The PR #73 apparently introduced a bug because `undefined` options are not gracefully handled by graphy

## 0.3.3

### Patch Changes

- 2519449: Options were not forwarded to graphy parsers

## 0.3.2

### Patch Changes

- 6d9de99: Update rdf-ns-builders

## 0.3.1

### Patch Changes

- 76d476a: Have numbers and booleans serialized in short form

## 0.3.0

### Minor Changes

- 36e1713: Improve Turtle/TriG serialization by using [Concise Quads Hash](https://graphy.link/concise#hash_c4)

## 0.2.1

### Patch Changes

- 49551ba: Module `./parsers/graphy.js` missing in build

## 0.2.0

### Minor Changes

- 34027af: Use `@graphy` parsers, which preserve blank node identifiers

## 0.1.1

### Patch Changes

- fac4158: Added LICENSE file

## 0.1.0

### Minor Changes

- 7a9bef2: Initial version of pretty-printing formats package
