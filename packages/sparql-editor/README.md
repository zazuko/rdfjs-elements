# sparql-editor

A text editor custom element which highlights and parses SPARQL queries.

It uses [sparqljs](https://npm.im/sparqljs) to parse the query text.

## Usage

Simply add the element to a page. It is possible to provide common prefixes and a base IRI
so that they don't have to be explicitly added in the SPARQL string

```js
import '@rdfjs-elements/sparql-editor'
import { html } from 'lit-html'

const value = `CONSTRUCT { ?s ?p ?o }
FROM <john-doe>
WHERE {
   <john-doe> a schema:Person ;
   schema:name "John Doe" .
}`

const template = html`<rdf-editor prefixes="schema" baseIRI="http://example.com/" .value="${value}"></rdf-editor>`
```

## Properties

| Property     | Attribute    | Modifiers | Type              | Default | Description                                      |
|--------------|--------------|-----------|-------------------|---------|--------------------------------------------------|
| `autoParse`  | `auto-parse` |           | `boolean`         |         | if set to true, parses the contents automatically when typing. Otherwise, parses on `blur` event |
| `baseIRI`    | `base-iri`   |           | `string`          |         | Value of the `BASE` directive which will be injected to the query |
| `codeMirror` |              | readonly  | `Element \| null` |         | The underlying `<wc-codemirror>` element         |
| `format`     |              | readonly  | `string`          |         |                                                  |
| `isParsing`  | `is-parsing` |           | `boolean`         |         | set to true while the elements parses data when the code has changed |
| `parseDelay` | `parseDelay` |           | `Number`          | 250     | time in milliseconds after which parsing will begin while typing. Only applies when `autoParse` is set |
| `prefixes`   | `prefixes`   |           | `string`          |         | a comma-separated list of prefixes to use for serializing. Always includes `rdf`, `rdfs` and `xsd` Any prefix included in the [`@zazuko/rdf-vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used |
| `query`      |              |           | `object`          |         | The JS object representing the query             |
| `readonly`   | `readonly`   |           | `boolean`         |         |                                                  |
| `ready`      |              |           | `Promise<void>`   |         | a one-time promise which resolves when CodeMirror has been initialized |
| `value`      | `value`      |           | `string`          |         | The raw contents of the code editor              |

## Methods

| Method  | Type                |
|---------|---------------------|
| `parse` | `(): Promise<void>` |

## Events

| Event            | Type                                            | Description                                      |
|------------------|-------------------------------------------------|--------------------------------------------------|
| `parsed`         | `CustomEvent<{ value: string; query: object }>` | when the editor contents have changed and have been successfully parsed |
| `parsing-failed` | `CustomEvent`                                   | when there as in an error in parsing the query   |

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
| `error`                       | Line or part of line highlighted as result of parsing error. By default style is red wavy underline |
