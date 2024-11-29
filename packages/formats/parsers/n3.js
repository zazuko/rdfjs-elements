import { lazySink } from '@zazuko/formats-lazy/LazySink.js'

export const N3Parser = lazySink(async () => {
  const n3 = await import('n3')
  return class {
    // eslint-disable-next-line class-methods-use-this
    import(quadStream, options) {
      return new n3.StreamParser({ format: 'text/n3' }).import(quadStream, {
        ...options,
      })
    }
  }
})
