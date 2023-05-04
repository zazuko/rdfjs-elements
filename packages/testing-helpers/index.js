module.exports = function factory() {
  return {
    name: 'stream-faker',
    transform(context) {
      if (context.url.match(/string-to-stream/)) {
        return {
          body: `export default function() {}`,
        }
      }
      if (context.url.match(/@graphy\/core.data.factory/)) {
        return {
          body: `export default {}`,
        }
      }
      if (context.url.match(/node_modules\/into-stream\/index.js$/)) {
        return {
          body: `export { default } from '@rdfjs-elements/testing/into-stream/index.js';`,
        }
      }
      if (
        context.url.match(/node_modules\/readable-stream\/readable.js$/) ||
        context.url.match(/node_modules\/readable-stream\/lib\/ours\/index.js$/)
      ) {
        return {
          body: `export * from '@rdfjs-elements/testing/stream/index.js';
export { default } from '@rdfjs-elements/testing/stream/index.js';`,
        }
      }
      if (context.url.match(/node_modules\/.+\/sink-map\/index.js$/)) {
        return {
          body: `
            import { FakeSinkMap } from '@rdfjs-elements/testing/sink-map/index.js';
            export { FakeSinkMap as SinkMap } from '@rdfjs-elements/testing/sink-map/index.js';
            export default FakeSinkMap;
          `,
        }
      }
      return context
    },
  }
}
