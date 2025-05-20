# @rdfjs-elements/lit-helpers

## 0.3.11

### Patch Changes

- 49d0a71: Label would not update when resource became `undefined`

## 0.3.10

### Patch Changes

- fbe2b71: Relax peer dependency on `@rdfjs/types`

## 0.3.9

### Patch Changes

- ff2a29e: Updated lit to v3

## 0.3.8

### Patch Changes

- c2957f5: The `fallback` parameter of `localizedLabel` should allow any type and let lit render it

## 0.3.7

### Patch Changes

- aef831f: Update clownface

## 0.3.6

### Patch Changes

- 90ebc06: Update to ESM-only dependencies

## 0.3.5

### Patch Changes

- 358a11e: Support multiple properties to selecte label for translation

## 0.3.4

### Patch Changes

- 3c2a711: Binding to properties and attributes would set a string `"[object Object]"`

## 0.3.3

### Patch Changes

- d53ef0a: Package needs `.` export to load in some environments
- 304f151: The use of `document` and `navigator` prevented importing in node

## 0.3.2

### Patch Changes

- 9dd26ee: `lib` missing in package

## 0.3.1

### Patch Changes

- 8b8c947: Extract separate function to get translated label of any pointer

## 0.3.0

### Minor Changes

- 9997d14: - Renamed `taggedLiteral` to `localizedLabel`. It renders a resource's label in display language
  - Create a new `taggedLiteral` which takes as argument a literal pointer

## 0.2.2

### Patch Changes

- fbd5755: Update `@tpluscode/rdf-ns-builders` to v2

## 0.2.1

### Patch Changes

- 4d8687e: Fallback value would get "lost" after calling `setLanguages`

## 0.2.0

### Minor Changes

- 350ddfe: Introduce a `fallback` parameter; made second parameter an object

### Patch Changes

- 350ddfe: Type declaration did not allow falsy pointer argument

## 0.1.1

### Patch Changes

- 36c2fa2: Add TypeScript type declarations

## 0.1.0

### Minor Changes

- ebd3720: `taggedLiteral` directive
