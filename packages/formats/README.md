# @rdfjs-elements/formats-pretty

Common RDF/JS parsers and serializers, the latter returning a nicely formatted output.

For usage see [`@rdfjs/formats-common`](https://npm.im/@rdfjs/formats-common)

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
