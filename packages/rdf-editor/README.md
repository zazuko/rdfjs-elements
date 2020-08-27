# rdf-editor

A text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.

## Usage

The element requires a single property/attribute `format` which should be an RDF serialization media type supported by
`@rdf-esm/formats-common` package.

The element is easiest to bootstrap by setting the `serialized` property **before** first render. This property is
only used to provide the initial contents of the editor as it is parsed on first render, when the element has been added
to the page.

```js
import '@rdfjs-elements/rdf-editor'
import { html } from 'lit-html'

const jsonld = {
   '@context': {
     '@base': 'http://example.com/',
     '@vocab': 'http://schema.org/'
   },
   '@id': 'john-doe',
   '@type': 'Person',
   '@name': 'John Doe'
}

const initialValue = JSON.stringify(jsonld, null, 2)

const template = html`<rdf-editor format="application/ld+json" .serialized="${initialValue}"></rdf-editor>`
```

By default most common formats are supported

- JSON-LD
- N-Triples
- N-Quads
- RDF/XML
- Turtle/N3
- TriG *(no highlighting)*

Syntax highlighting is relying on support from CodeMirror.

## Properties

| Property     | Attribute    | Modifiers | Type              | Description                                      |
|--------------|--------------|-----------|-------------------|--------------------------------------------------|
| `codeMirror` |              | readonly  | `Element \| null` | The underlying `<wc-codemirror>` element         |
| `format`     | `format`     |           | `string`          | Media type of the RDF serialization to use.<br /><br />Custom parsers and serializers must be added to `@rdf-esm/formats-common` |
| `prefixes`   | `prefixes`   |           | `string`          | a comma-separated list of prefixes to use for serializing. Always includes `rdf`, `rdfs` and `xsd` Any prefix included in the [`@zazuko/rdf-vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used |
| `quads`      | `quads`      |           | `Quad[]`          | get or sets the RDF/JS quads                     |
| `readonly`   | `readonly`   |           | `boolean`         |                                                  |
| `ready`      |              |           | `Promise<void>`   | a one-time promise which resolves when CodeMirror has been initialized |
| `serialized` | `serialized` |           | `string`          | The string representation of the RDF graph.<br /><br />Note that this property is only used to set the initial value of the editor. For updates `quads` should be used |

## Events

| Event            | Type                                             | Description                                      |
|------------------|--------------------------------------------------|--------------------------------------------------|
| `parsing-failed` | `CustomEvent<{ notFound?: boolean; error?: Error; }>` | when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason |
| `quads-changed`  | `CustomEvent<{ quads: Quad[]; }>`                | when the editor contents have changed and have been successfully parsed |
| `serialized`     | `CustomEvent<{ value: string; }>`                |                                                  |

## CSS Shadow Parts

| Part                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `CodeMirror`                  | The main CodeMirror wrapper element. This and other parts are directly generated from CSS classes set by CodeMirror and should be fairly self-explanatory but not equally useful 😉 |
| `CodeMirror-code`             |                                                  |
| `CodeMirror-cursors`          |                                                  |
| `CodeMirror-gutter-filler`    |                                                  |
| `CodeMirror-gutters`          |                                                  |
| `CodeMirror-hscrollbar`       |                                                  |
| `CodeMirror-linenumbers`      |                                                  |
| `CodeMirror-lines`            |                                                  |
| `CodeMirror-measure`          |                                                  |
| `CodeMirror-scroll`           |                                                  |
| `CodeMirror-scrollbar-filler` |                                                  |
| `CodeMirror-sizer`            |                                                  |
| `CodeMirror-vscrollbar`       |                                                  |
