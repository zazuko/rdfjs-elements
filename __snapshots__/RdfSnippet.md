# `RdfSnippet`

#### `renders list items for every displayed format`

```html
<div id="wrapper">
  <ol>
    <li
      input=""
      selected=""
    >
      RDF/XML
    </li>
    <li output="">
      JSON‑LD
    </li>
    <li output="">
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
      selected=""
    >
      RDF/XML
    </li>
    <li output="">
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

