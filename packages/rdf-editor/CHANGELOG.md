# @rdfjs-elements/rdf-editor

## 0.5.2

### Patch Changes

- b8dca60: Editor would sometimes not parse on initial change of `.format` property

## 0.5.1

### Patch Changes

- Updated dependencies [e31f1ac]
  - @rdfjs-elements/formats-pretty@0.4.0

## 0.5.0

### Minor Changes

- 970c196: Update to lit@2

### Patch Changes

- 473d6dd: In certain serializations the editor would scroll up to the top on parse errors. This would have happened if the precise line could not have been determined from the error raised by the respective parser
- c0e1f44: Emit a `prefixes-parsed` event with prefix map parsed from the editor's contents
- Updated dependencies [5f52d07]
- Updated dependencies [473d6dd]
- Updated dependencies [970c196]
  - @rdfjs-elements/formats-pretty@0.3.4
  - @rdfjs-elements/editor-base@0.4.0

## 0.4.6

### Patch Changes

- 6d9de99: Update rdf-ns-builders
- Updated dependencies [6d9de99]
  - @rdfjs-elements/editor-base@0.3.3
  - @rdfjs-elements/formats-pretty@0.3.2

## 0.4.5

### Patch Changes

- 8ee9308: Add `noReserialize` property

## 0.4.4

### Patch Changes

- c9fe730: wait for `<code-mirror>` to be ready before serialising `.quads`
- Updated dependencies [bbd4a99]
- Updated dependencies [1d5ee27]
  - @rdfjs-elements/editor-base@0.3.0

## 0.4.3

### Patch Changes

- 7f0e1a9: Add the possibility to define custom prefix map
- Updated dependencies [76d476a]
  - @rdfjs-elements/formats-pretty@0.3.1

## 0.4.2

### Patch Changes

- Updated dependencies [36e1713]
  - @rdfjs-elements/formats-pretty@0.3.0

## 0.4.1

### Patch Changes

- Updated dependencies [f634b3a]
  - @rdfjs-elements/editor-base@0.2.0

## 0.4.0

### Minor Changes

- 3548e77: BREAKING: Remove property `.serialized`

  Instead, use the property `.value` which now can be used to replace the text contents of the editor

## 0.3.10

### Patch Changes

- Updated dependencies [34027af]
  - @rdfjs-elements/formats-pretty@0.2.0

## 0.3.9

### Patch Changes

- 2d71f49: Add .value property
- 14e1621: Add option to parse automaticlly when typing
- Updated dependencies [2d71f49]
- Updated dependencies [14e1621]
  - @rdfjs-elements/editor-base@0.1.2

## 0.3.8

### Patch Changes

- fac4158: Updated LICENSE year
- Updated dependencies [fac4158]
  - @rdfjs-elements/editor-base@0.1.1
  - @rdfjs-elements/formats-pretty@0.1.1

## 0.3.7

### Patch Changes

- d0f7ead: Error highlighting
- 8b0d8e6: Reflect `is-parsing` attribute
- Updated dependencies [b6ae5fc]
- Updated dependencies [d0f7ead]
  - @rdfjs-elements/editor-base@0.1.0

## 0.3.6

### Patch Changes

- 3b4e1b5: Add `isParsing` property on rdf-editor

## 0.3.5

### Patch Changes

- c989b8f: Upgrade @tplusode/rdf-ns-builders and @rdf-esm/data-model

## 0.3.4

### Patch Changes

- 16005be: Do not use optional chaining syntax

## 0.3.3

### Patch Changes

- 4fbc669: Prevent .quads from ever being undefined
- aeec100: Prevent unnecessary parsing when content does not change

## 0.3.2

### Patch Changes

- a0aa402: Only serialize on prefix change when there are quads to prevent discarding of initial string value

## 0.3.1

### Patch Changes

- 6d585e3: Updating prefixes property should reserialize data

## 0.3.0

### Minor Changes

- 519435d: Switched to Turtle and JSON-LD serializers to ones that support better formatting
  Added a Trig serializer

### Patch Changes

- 54a319d: Property to set prefixes used when serializing the input quads
- fe02249: Added RDF/XML serializer support

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
