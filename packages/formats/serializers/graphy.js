import { TransformToConciseHash } from './TransformToConciseHash.js'

async function serializer(importScribe, { strict, ...defaults } = {}) {
  const create = (await importScribe).default

  return {
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
    },
  }
}

export const turtle = ({ prefixes } = {}) =>
  serializer(import('@graphy/content.ttl.write'), { prefixes })
export const rdfXml = ({ prefixes } = {}) =>
  serializer(import('@graphy/content.xml.scribe'), { strict: true, prefixes })
export const trig = ({ prefixes } = {}) =>
  serializer(import('@graphy/content.trig.write'), { prefixes })
