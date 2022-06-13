---
'@rdfjs-elements/formats-pretty': minor
---

By default, RDF Lists will always be serialized in shorthand syntax, even if the intermediate nodes have additional properties.

To preserve any additional properties, use `preserveListNodeProperties` option of the sinks' `import` method

```js
sink.import(graph, { preserveListNodeProperties: true })
```
