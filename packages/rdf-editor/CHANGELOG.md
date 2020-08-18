# @rdfjs-elements/rdf-editor

## 0.2.4

### Patch Changes

- 22ea655: Injecting shadow parts to CodeMirror elements

## 0.2.3

### Patch Changes

- eb8d8af: JSON-LD should be stringified with proper indentation
- 102e90a: `serialized` property is now updated when quads are parsed

## 0.2.2

### Patch Changes

- e37a4d9: Update `@rdf-esm/formats-common` to have proper import of RDF/XML parser
- ca3aac4: Disconnected callback would cause phantom codemirrors
- ce4da12: Replace into-stream dependency with readable-stream

## 0.2.1

### Patch Changes

- fix: quads setter was not updating the serialized contents

## 0.2.0

### Minor Changes

- e6dbcf2: BREAKING CHANGES:
  - added syntax highlighing for RDF/XML
  - element parses the RDF automatically and dispatches events (quads is now an ordinary property)
- 1cf4d51: fix(rdf-editor): corrected the exports and main fields

### Patch Changes

- aec0d16: readonly property did not work after initial render
- f6e0662: fix(rdf-editor): `format` was not updating code mirror and not reflecting attribute

## 0.1.0

### Minor Changes

- 744a2ba: Initial version of the `<rdf-editor>` element
