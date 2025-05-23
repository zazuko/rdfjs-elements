# rdf-snippet

An RDF viewer which allows switching between various serializations.

## Default usage

The initial text of the RDF snippet must be added inside a child `<script>` element with `type` attribute set to the appropriate
RDF media type. The element's `formats` property selects the media types which should be available as alternative serializations.

```html
<rdf-snippet formats="application/ld+json,application/n-quads">
  <script type="text/turtle">
＠base <http://example.com/> .
＠prefix schema: <http://schema.org/> .

<john> a schema:Person ;
  schema:name "John Doe" .
  </script>
</rdf-snippet>
```

The initial RDF representation remains unchanged, while selecting the output formats re-serializes the actual triples and presents the output.

## Usage with properties

In case when a `<script>` cannot be used, the snippet can be initialized by passing the serialized input and input format using properties/attributes

```html
<rdf-snippet .input="${turtle}" input-format="text/turtle">
</rdf-snippet>
```

## Supported types

Out of the box all common RDF formats are supported, where some can only be used for the input (no serializer available):

- JSON-LD
- N-Triples
- N-Quads
- Turtle/N3
- TriG *(input only)*
- RDF/XML *(input only)*

Support for additional types can be added by registering an RDF/JS-compliant parser and/or serializer using the [`@rdfjs/formats-common`](https://npm.im/@rdfjs/formats-common)
package.

## Properties

| Property         | Attribute        | Modifiers | Type                       | Default       | Description                                      |
|------------------|------------------|-----------|----------------------------|---------------|--------------------------------------------------|
| `customPrefixes` | `customPrefixes` |           | `object`                   | {}            |                                                  |
| `formats`        | `formats`        |           | `string`                   |               | comma-separated list of output formats           |
| `input`          |                  |           | `string`                   |               | set the input serialized value (ignored when `<script>` is used) |
| `inputFormat`    | `input-format`   |           | `string`                   | "text/turtle" | set the format of the input (ignored when `<script>` is used) |
| `layout`         | `layout`         |           | `"vertical"\|"horizontal"` |               | controls the position of selection buttons       |
| `onlyOutput`     | `only-output`    |           | `boolean`                  |               | hides the input editor and only shows the outputs |
| `prefixes`       | `prefixes`       |           | `string`                   | ""            | a comma-separated list of prefixes to use for serializing. Any prefix included in the [`@zazuko/vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used |
| `selectedFormat` |                  |           | `string`                   |               | gets the selected output format                  |
| `value`          |                  | readonly  | `string`                   |               | Gets the text contents of the currently showing editor |

## Events

| Event           | Type                              | Description                                |
|-----------------|-----------------------------------|--------------------------------------------|
| `quads-changed` | `CustomEvent<{ value: Quad[] }>`  | dispatched when the input quads are parsed |
| `value-changed` | `CustomEvent<{ value: string; }>` |                                            |

## CSS Shadow Parts

| Part       | Description                             |
|------------|-----------------------------------------|
| `format`   | every format selection button           |
| `input`    | selection button for the input format   |
| `output`   | selection button for the output formats |
| `selected` | the currently selected format button    |
