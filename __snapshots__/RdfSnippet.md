# `RdfSnippet`

#### `renders list items for every displayed format`

```html
<div id="wrapper">
  <ol>
    <li
      input=""
      part="format input selected"
    >
      RDF/XML
    </li>
    <li
      output=""
      part="format output "
    >
      JSON‑LD
    </li>
    <li
      output=""
      part="format output "
    >
      Turtle
    </li>
  </ol>
  <rdf-editor
    format="application/rdf+xml"
    id="input"
    readonly=""
    visible=""
  >
  </rdf-editor>
  <rdf-editor
    format="application/ld+json"
    id="output"
    readonly=""
  >
  </rdf-editor>
</div>

```

#### `switching output changes the output editor format`

```html
<div id="wrapper">
  <ol>
    <li
      input=""
      part="format input selected"
    >
      RDF/XML
    </li>
    <li
      output=""
      part="format output "
    >
      JSON‑LD
    </li>
  </ol>
  <rdf-editor
    format="application/rdf+xml"
    id="input"
    readonly=""
    visible=""
  >
  </rdf-editor>
  <rdf-editor
    format="application/ld+json"
    id="output"
    readonly=""
  >
  </rdf-editor>
</div>

```

