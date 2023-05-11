import { lazySink } from '@zazuko/formats-lazy/LazySink.js'
import { TransformToConciseHash } from './TransformToConciseHash.js'
import { coercions } from './graphy/coercions.js'

async function serializer(importScribe, writerOptions = {}) {
  const create = (await importScribe).default

  return class {
    constructor(defaults = {}) {
      this.defaults = defaults
    }

    // eslint-disable-next-line class-methods-use-this
    import(quadStream, { preserveListNodeProperties, ...options } = {}) {
      const prefixes = {
        ...(this.defaults.prefixes || {}),
        ...(options.prefixes || {}),
      }

      const writer = create({
        prefixes,
        coercions: writerOptions.coercions,
      })

      quadStream
        .pipe(
          new TransformToConciseHash({
            prefixes,
            strict: writerOptions.strict,
            preserveListNodeProperties,
          })
        )
        .pipe(writer)

      return writer
    }
  }
}

export const TurtleSerializer = lazySink(() =>
  serializer(import('@graphy/content.ttl.write'), { coercions })
)
export const RdfXmlSerializer = lazySink(() =>
  serializer(import('@graphy/content.xml.scribe'), { strict: true })
)
export const TrigSerializer = lazySink(() =>
  serializer(import('@graphy/content.trig.write'), { strict: true, coercions })
)
