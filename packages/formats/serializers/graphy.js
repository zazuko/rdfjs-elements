import { lazySink } from '@zazuko/formats-lazy/LazySink.js'
import { TransformToConciseHash } from './TransformToConciseHash.js'

async function serializer(importScribe, { strict, ...defaults } = {}) {
  const create = (await importScribe).default

  return class {
    // eslint-disable-next-line class-methods-use-this
    import(quadStream, { preserveListNodeProperties, ...options } = {}) {
      const prefixes = {
        ...(defaults.prefixes || {}),
        ...(options.prefixes || {}),
      }

      const writer = create({
        prefixes,
      })

      quadStream
        .pipe(
          new TransformToConciseHash({
            prefixes,
            strict,
            preserveListNodeProperties,
          })
        )
        .pipe(writer)

      return writer
    }
  }
}

export const TurtleSerializer = lazySink(() =>
  serializer(import('@graphy/content.ttl.write'))
)
export const RdfXmlSerializer = lazySink(() =>
  serializer(import('@graphy/content.xml.scribe'), { strict: true })
)
export const TrigSerializer = lazySink(() =>
  serializer(import('@graphy/content.trig.write'), { strict: true })
)
