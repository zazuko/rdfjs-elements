async function serializer(importScribe) {
  const create = (await importScribe).default

  return {
    import(quadStream, { prefixes = {} } = {}) {
      const writer = create({
        prefixes,
      })
      writer.import(quadStream)

      return writer
    },
  }
}

export const turtle = () => serializer(import('@graphy/content.ttl.scribe'))
// export const rdfXml = () => serializer(import('@graphy/content.xml.scribe')) TODO: uncomment when fixed in blake-regalia/graphy.js#31
export const trig = () => serializer(import('@graphy/content.trig.scribe'))
