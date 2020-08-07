# rdf-editor

An text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.

## Properties

| Property     | Attribute  | Modifiers | Type              | Description                                      |
|--------------|------------|-----------|-------------------|--------------------------------------------------|
| `codeMirror` |            | readonly  | `Element \| null` | The underlying `<wc-codemirror>` element         |
| `format`     | `format`   |           | `string`          | Media type of the RDF serialization to use.<br /><br />Custom parsers and serializers must be added to @rdf-esm/formats-common |
| `quads`      |            |           | `Promise<any[]>`  | Array of RDF/JS quads<br /><br />The getter is async! |
| `readonly`   | `readonly` |           | `boolean`         |                                                  |
| `serialized` |            |           | `string`          | The string representation of the RDF graph.<br /><br />The syntax is not validated until quads getter is invoked. |
