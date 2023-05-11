---
'@rdfjs-elements/formats-pretty': minor
---

Removed exports of instances of sinks. Instead, classes are exported. For example

```diff
-import { jsonld } from '@rdfjs-elements/formats-pretty'
+import { JsonLdSerializer } from '@rdfjs-elements/formats-pretty'
+
+const jsonld = new JsonLdSerializer()
```
