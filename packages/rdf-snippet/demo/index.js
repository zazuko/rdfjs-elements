import 'api-viewer-element'
import '../rdf-snippet.js'

import('../custom-elements.json').then(data => {
  document.querySelector('api-viewer').elements = data.tags
})
