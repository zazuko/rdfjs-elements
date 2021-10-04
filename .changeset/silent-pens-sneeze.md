---
'@rdfjs-elements/formats-pretty': patch
---

Do not pass `undefined` to graphy parser

The PR #73 apparently introduced a bug because `undefined` options are not gracefully handled by graphy
