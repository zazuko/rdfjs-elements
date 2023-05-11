import { lazySink } from '@zazuko/formats-lazy/LazySink.js'

async function parser(module) {
  const create = (await module).default

  return class {
    // eslint-disable-next-line class-methods-use-this
    import(quadStream, options) {
      return quadStream.pipe(options ? create(options) : create())
    }
  }
}

export const TrigParser = lazySink(() =>
  parser(import('@graphy/content.trig.read'))
)
export const NQuadsParser = lazySink(() =>
  parser(import('@graphy/content.nq.read'))
)
