# rdf-editor

**Mixins:** EnvironmentMixin

## Properties

| Property         | Attribute        | Modifiers | Type                     | Default       | Description                                      |
|------------------|------------------|-----------|--------------------------|---------------|--------------------------------------------------|
| `$rdf`           |                  |           |                          | "environment" |                                                  |
| `autoParse`      | `auto-parse`     |           | `boolean`                |               | if set to true, parses the contents automatically when typing. Otherwise, parses on `blur` event |
| `codeMirror`     |                  | readonly  | `Element \| null`        |               | The underlying `<wc-codemirror>` element         |
| `customPrefixes` | `customPrefixes` |           | `Record<string, string>` | {}            | a map of custom prefixes or overrides            |
| `format`         | `format`         |           | `string`                 |               | Media type of the RDF serialization to use.<br /><br />Custom parsers and serializers must be added to `@rdf-esm/formats-common` |
| `isParsing`      | `is-parsing`     |           | `boolean`                | false         | set to true while the elements parses data when the code has changed |
| `noReserialize`  | `no-reserialize` |           | `boolean`                | false         | Prevents the editor from serializing the quads when format changes |
| `parseDelay`     | `parseDelay`     |           | `Number`                 | 250           | time in milliseconds after which parsing will begin while typing. Only applies when `autoParse` is set |
| `prefixes`       | `prefixes`       |           | `string`                 |               | a comma-separated list of prefixes to use for serializing. Any prefix included in the [`@zazuko/rdf-vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used |
| `quads`          | `quads`          |           | `Quad[]`                 |               | get or sets the RDF/JS quads                     |
| `readonly`       | `readonly`       |           | `boolean`                |               |                                                  |
| `ready`          | `ready`          |           | `Promise<void>`          |               | a one-time promise which resolves when CodeMirror has been initialized |
| `value`          | `value`          |           | `string`                 |               | The string representation of the RDF graph.      |

## Methods

| Method  | Type                |
|---------|---------------------|
| `parse` | `(): Promise<void>` |

## Events

| Event             | Type                                             | Description                                      |
|-------------------|--------------------------------------------------|--------------------------------------------------|
| `parsing-failed`  | `CustomEvent<{ notFound?: boolean; error?: Error; }>` | when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason |
| `prefixes-parsed` | `CustomEvent<{ prefixes: Record<string, string>; }>` | prefixes returned by parser                      |
| `quads-changed`   | `CustomEvent<{ quads: Quad[]; }>`                | when the editor contents have changed and have been successfully parsed |
| `serialized`      | `CustomEvent<{ value: string; }>`                |                                                  |

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
