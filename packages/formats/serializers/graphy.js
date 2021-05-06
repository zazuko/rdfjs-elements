import { TransformToConciseHash } from './TransformToConciseHash.js'

async function serializer(importScribe, strict) {
  const create = (await importScribe).default

  return {
    import(quadStream, { prefixes = {} } = {}) {
      const writer = create({
        prefixes,
      })

      quadStream
        .pipe(new TransformToConciseHash({ prefixes, strict }))
        .pipe(writer)

      return writer
    },
  }
}

export const turtle = () => serializer(import('@graphy/content.ttl.write'))
export const rdfXml = () =>
  serializer(import('@graphy/content.xml.scribe'), true)
export const trig = () => serializer(import('@graphy/content.trig.write'))
