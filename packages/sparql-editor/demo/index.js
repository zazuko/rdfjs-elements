import 'api-viewer-element'
import '../sparql-editor.js'

import('../custom-elements.json').then(data => {
  document.querySelector('api-viewer').elements = data.tags
})
