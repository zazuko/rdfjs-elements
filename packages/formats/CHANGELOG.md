# @rdfjs-elements/formats-pretty

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
