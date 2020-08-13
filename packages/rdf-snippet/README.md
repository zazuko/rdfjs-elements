# rdf-snippet

An RDF viewer which allows switching between various serializations.

## Usage

The initial text of the RDF snippet must be added inside a child `<script>` element with `type` attribute set to the appropriate
RDF media type. The element's `formats` property selects the media types which should be available as alternative serializations.

The initial RDF representation remains unchanged, while selecting the output formats re-serializes the actual triples and presents the output.

## Supported types

Out of the box all common RDF formats are supported, where some can only be used for the input (no serializer available):

- JSON-LD
- N-Triples
- N-Quads
- Turtle/N3
- TriG *(input only)*
- RDF/XML *(input only)*

Support for additional types can be added by registering an RDF/JS-compliant parser and/or serializer using the [`@rdf-esm/formats-common`](https://npm.im/@rdf-esm/formats-common)
package:

```js
import { parsers, serializers } from '@rdf-esm/formats-common'

// by importing dynamically, the code will only be loaded when needed
parsers.set('application/trix', async () => {
   const TrixParser = await import('@hypothetical/trix-parser')
   return new TrixParser()
})

serializers.set('application/trix', async () => {
   const TrixSerializer = await import('@hypothetical/trix-serializer')
   return new TrixSerializer()
})
```

## Properties

| Property         | Attribute | Type                       | Default | Description                                      |
|------------------|-----------|----------------------------|---------|--------------------------------------------------|
| `formats`        | `formats` | `string`                   | ""      | comma-separated list of output formats           |
| `layout`         | `layout`  | `"vertical"\|"horizontal"` |         | controls the position of selection buttons       |
| `selectedFormat` |           | `string`                   |         | gets the selected output format                  |
| `show`           | `show`    | `"input"\|"output"`        | "input" | gets a value indicating whether the input or editor is shown |
