module.exports = function factory() {
  return function streamFaker(context) {
    if (context.url.match(/@rdf-esm\/formats-common\/index.js$/)) {
      return {
        body: `export { parsers, serializers } from '@rdfjs-elements/testing/formats-common/index.js';`,
      }
    }
    if (context.url.match(/string-to-stream/)) {
      return {
        body: `export default function() {}`,
      }
    }
    if (context.url.match(/node_modules\/into-stream\/index.js$/)) {
      return {
        body: `export { default } from '@rdfjs-elements/testing/into-stream/index.js';`,
      }
    }
    if (context.url.match(/node_modules\/readable-stream\/readable.js$/)) {
      return {
        body: `export * from '@rdfjs-elements/testing/stream/index.js';
export { default } from '@rdfjs-elements/testing/stream/index.js';`,
      }
    }
    return context
  }
}
