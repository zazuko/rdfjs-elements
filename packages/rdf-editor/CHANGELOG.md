# @rdfjs-elements/rdf-editor

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
