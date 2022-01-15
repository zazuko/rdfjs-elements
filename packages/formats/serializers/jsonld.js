export default async function (defaults = {}) {
  const JsonLdSerializer = (await import('@rdfjs/serializer-jsonld-ext'))
    .default

  class Serializer extends JsonLdSerializer {
    import(stream, { prefixes = {} } = {}) {
      return super.import(stream, {
        context: {
          ...(defaults.prefixes || {}),
          ...prefixes,
        },
      })
    }
  }

  return new Serializer({
    compact: true,
    skipGraphProperty: true,
    encoding: 'string',
  })
}
