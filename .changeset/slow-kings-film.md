---
'@rdfjs-elements/rdf-editor': patch
'@rdfjs-elements/editor-base': patch
---

In certain serializations the editor would scroll up to the top on parse errors. This would have happened if the precise line could not have been determined from the error raised by the respective parser
