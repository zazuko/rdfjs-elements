# `@rdfjs-elements/lit-helpers`

Useful utilities for using `lit-html` and `LitElement` together with RDF/JS objects.

## `localizedLabel` directive

Use it to render resource's label of [tagged literals](https://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal) by 
selecting the object matching user's preferred locale.

## `taggedLiteral` directive

Similar to `localizedLabel` but its argument is a pointer to a literal and not resource pointer.

All usages in a page will use the same language setting, which be default is to select the best matching literals 
prioritised according to the [`navigator.languages`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages) 
property.

### Usage

All examples use assume these resources

```turtle
prefix sh: <http://www.w3.org/ns/shacl#>
prefix ex: <http://example.org/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

<apple>
  a ex:Apple ;
  rdfs:label "Apple"@en, "Apfel"@de, "Jabłko"@pl ;
.

<Fruit>
  a sh:NodeShape ;
  sh:property [ sh:name "name"@en, "Name"@de, "Nazwa"@pl ] ;
.
```

#### Basic usage of `localizedLabel`

To render the `rdfs:label` using the browser's default setting

```ts
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type { GraphPointer } from 'clownface'

let apple: GraphPointer

function render() {
  // renders apple's rdfs:label property
  return html`<span>${localizedLabel(apple, { fallback: 'a fruit' })}</span>`
}
```

_The second parameter is optional. `fallback` will be rendered if no label was found_

#### Basic usage of `taggedLiteral`

Similar to the above but useful when only a direct literal pointer is available

```ts
import { html } from 'lit'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'
import type { GraphPointer } from 'clownface'

let apple: GraphPointer
let label = apple.out(rdfs.label)

function render() {
  // renders apple's rdfs:label property
  return html`<span>${taggedLiteral(label, { fallback: 'a fruit' })}</span>`
}
```

_The second parameter is optional. `fallback` will be rendered if no label was found_

#### Using `localizedLabel` different predicate

Pass second argument to use a different predicate

```ts
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type { GraphPointer } from 'clownface'
import { sh } from '@tpluscode/rdf-ns-builders'

let fruit: GraphPointer

function render() {
  // renders PropertyShape's sh:name property
  return html`<span>${localizedLabel(fruit.out(sh.property), { property: sh.name })}</span>`
}
```

### Switching language

At any point during page's lifecycle the language can be changed by calling the `setLanguages` function. It will 
automatically update all occurrences of `taggedLiteral` and `localizedLabel` directives on a page to reflect the new
priority of languages.

```ts
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { setLanguages } from '@rdfjs-elements/lit-helpers'
import type { GraphPointer } from 'clownface'

let apple: GraphPointer

function render() {
  // renders apple's rdfs:label property using current langauges
  return html`<span>${localizedLabel(apple)}</span>`
}

// switch to Swiss German or German
setLanguages('de-CH', 'de')
```

### Using `localizedLabel` with rdfine objects

```ts
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type { GraphPointer } from 'clownface'
import Environment from '@zazuko/env/Environment.js'
import RdfineEnv from '@rdfine/env'
import Shacl from '@rdfine/shacl/Factory'

const env = new Environment([Shacl], { parent: RdfineEnv })

let fruitPointer: GraphPointer
const fruit = env.rdfine.sh.NodeShape(fruitPointer)

function render() {
  // renders PropertyShape's sh:name property
  return html`<span>${localizedLabel(fruit.property[0], { property: sh.name })}</span>`
}
```
