# @rdfjs-elements/editor-base

## 0.5.0

### Minor Changes

- 90ebc06: The package is now explicitly marked as ESM-only

### Patch Changes

- 90ebc06: Update to ESM-only dependencies

## 0.4.2

### Patch Changes

- fbd5755: Update `@tpluscode/rdf-ns-builders` to v2

## 0.4.1

### Patch Changes

- 0164e64: Remove the default prefixes `rdf, rdfs, xsd` (closes #95)

## 0.4.0

### Minor Changes

- 970c196: Update to lit@2

### Patch Changes

- 473d6dd: In certain serializations the editor would scroll up to the top on parse errors. This would have happened if the precise line could not have been determined from the error raised by the respective parser

## 0.3.3

### Patch Changes

- 6d9de99: Update rdf-ns-builders

## 0.3.2

### Patch Changes

- 2c65633: Fixes some issues with synchronization (fixes #62)
- 91c0f7b: Move `customPrefixes` to base editor class

## 0.3.1

### Patch Changes

- af70a4b: In some cases the editor appears to be half-initialized if it was hidden by styles

## 0.3.0

### Minor Changes

- 1d5ee27: Improve loading code-mirror styles:

  - prevent broken layout if styles do not load on time
  - no FOUC - editor is hidden until ready to display

### Patch Changes

- bbd4a99: fix: error thrown when element gets detached

## 0.2.1

### Patch Changes

- efa37df: Setting same value should not move caret position

## 0.2.0

### Minor Changes

- f634b3a: Bump version only

## 0.1.2

### Patch Changes

- 2d71f49: Add .value property
- 14e1621: Add option to parse automaticlly when typing

## 0.1.1

### Patch Changes

- fac4158: Added LICENSE file

## 0.1.0

### Minor Changes

- b6ae5fc: Extracted a shared base class for implemented the editors

### Patch Changes

- d0f7ead: Error highlighting
