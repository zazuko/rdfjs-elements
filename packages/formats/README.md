# @rdfjs-elements/formats-pretty

Common RDF/JS parsers and serializers, the latter returning a nicely formatted output.

For basic usage see [`@rdfjs/formats-common`](https://npm.im/@rdfjs/formats-common)

## Serializers

| Format | Pretty or not | Implementation |
| -- | -- | -- |
| application/ld+json | 😀 | [@rdfjs/serializer-jsonld-ext](https://npm.im/@rdfjs/serializer-jsonld-ext) |
| application/trig | 🤩 | [@graphy/content.trig.writer](https://npm.im/@graphy/content.trig.writer) | 
| text/n3 | 🤩 | [@graphy/content.ttl.writer](https://npm.im/@graphy/content.ttl.writer) | 
| text/turtle | 🤩 | [@graphy/content.ttl.writer](https://npm.im/@graphy/content.ttl.writer) | 
| application/n-triples | 😶 | [@rdfjs/serializer-ntriples](https://npm.im/@rdfjs/serializer-ntriples) | 
| application/n-quads | 😶 | [@rdfjs/serializer-ntriples](https://npm.im/@rdfjs/serializer-ntriples) | 
| application/rdf+xml | 😶 | [@graphy/content.xml.scribe](https://npm.im/@graphy/content.xml.scribe) |

Individual serializer skins can also be created by importing from `@rdfjs-elements/formats-pretty/serializers`. This 
allows for initializing a sink preloaded with a given set of prefixes.

```js
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import { turtle } from '@rdfjs-elements/formats-pretty/serializers'

const { schema, dcterms, foaf } = prefixes

const sink = await turtle({
  prefixes: { schema, dcterms, foaf, ex:'http://example/org/' }
})
```

This sink can then be used to produce pretty-printed RDF

```js
import rdf from '@rdfjs/data-model'
import { Readable } from 'readable-stream'
import getStream from 'get-stream'

// Example data
const data = [
  rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Alice')),
  rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://xmlns.com/foaf/0.1/knows'), rdf.namedNode('http://example/org/o1')),
  rdf.quad(rdf.namedNode('http://example/org/o1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Bob'))
]

const stream = await sink.import(Readable.from(data))
console.log(await getStream(stream))

// Outputs:

// @prefix schema: <http://schema.org/> .
// @prefix dcterms: <http://purl.org/dc/terms/> .
// @prefix foaf: <http://xmlns.com/foaf/0.1/> .
// @prefix ex: <http://example/org/> .
//
//   ex:s1 schema:name "Alice" ;
//        foaf:knows ex:o1 .
//
//   ex:o1 schema:name "Bob" .

```

## Parsers

| Format | Implementation |
| -- | -- |
| application/ld+json | [@rdfjs/parser-jsonld](https://npm.im/@rdfjs/parser-jsonld) |
| application/trig | [@rdfjs/parser-n3](https://npm.im/@rdfjs/parser-n3) | 
| text/n3 | [@rdfjs/parser-n3](https://npm.im/@rdfjs/parser-n3) | 
| text/turtle | [@rdfjs/parser-n3](https://npm.im/@rdfjs/parser-n3) | 
| application/n-triples | [@rdfjs/parser-n3](https://npm.im/@rdfjs/parser-n3) | 
| application/n-quads | [@rdfjs/parser-n3](https://npm.im/@rdfjs/parser-n3) | 
| application/rdf+xml | [rdfxml-streaming-parser](https://npm.im/rdfxml-streaming-parser) |
