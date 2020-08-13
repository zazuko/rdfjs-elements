# rdf-editor

An text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.

## Properties

| Property     | Attribute    | Modifiers | Type              | Description                                      |
|--------------|--------------|-----------|-------------------|--------------------------------------------------|
| `codeMirror` |              | readonly  | `Element \| null` | The underlying `<wc-codemirror>` element         |
| `format`     | `format`     |           | `string`          | Media type of the RDF serialization to use.<br /><br />Custom parsers and serializers must be added to `@rdf-esm/formats-common` |
| `quads`      | `quads`      |           | `array`           | Gets or set RDF/JS quads. Setting will parse them using the chosen `format` and set to the text editor |
| `readonly`   | `readonly`   |           | `boolean`         |                                                  |
| `ready`      |              |           | `Promise<any>`    |                                                  |
| `serialized` | `serialized` |           | `string`          | The string representation of the RDF graph.<br /><br />Note that this property is only used to set the initial value of the editor. For updates `quads` should be used |

## Events

| Event            | Type                                  | Description                                      |
|------------------|---------------------------------------|--------------------------------------------------|
| `parsing-failed` | `CustomEvent<{ notFound: boolean; }>` | when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason |
| `quads-changed`  | `CustomEvent<{ value: any[]; }>`      | when the editor contents have changed and have been successfully parsed |
