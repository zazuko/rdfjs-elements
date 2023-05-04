// eslint-disable-next-line max-classes-per-file
import { lazySink } from '@zazuko/formats-lazy/LazySink.js'

export default lazySink(async () => {
  const Impl = (await import('@rdfjs/serializer-jsonld-ext')).default

  return class Serializer extends Impl {
    constructor({ prefixes = {}, ...options } = {}) {
      super({
        compact: true,
        skipGraphProperty: true,
        encoding: 'string',
        ...options,
      })
      this.prefixes = prefixes
    }

    import(stream, { prefixes = {} } = {}) {
      const context = { ...this.prefixes, ...prefixes }

      return super.import(stream, { context })
    }
  }
})
