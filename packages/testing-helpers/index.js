module.exports = function factory () {
  return function streamFaker(context) {
    if (context.url.match(/@rdf-esm\/formats-common\/index.js$/)) {
      return {
        body: `export { parsers, serializers } from '@rdfjs-elements/testing/formats-common/index.js';`
      }
    }
    if (context.url.match(/string-to-stream/)) {
      return {
        body: `export default function() {}`
      }
    }
    if (context.url.match(/into-stream/)) {
      return {
        body: `export default function() {}`
      }
    }
    return context
  }
}
