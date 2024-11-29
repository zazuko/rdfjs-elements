import formatsCommon from '@zazuko/formats-lazy'
import Formats from '@rdfjs/formats/lib/Formats.js'
import {
  TurtleSerializer,
  RdfXmlSerializer,
  TrigSerializer,
} from './serializers/graphy.js'
import { TrigParser, NQuadsParser } from './parsers/graphy.js'
import JsonLdSerializer from './serializers/jsonld.js'
import { N3Parser } from './parsers/n3.js'

const formats = new Formats({})
formats.import(formatsCommon)

export default formats
export * from './parsers/graphy.js'
export * from './serializers/graphy.js'
export { default as JsonLdSerializer } from './serializers/jsonld.js'

export const mediaTypes = {
  jsonLd: 'application/ld+json',
  ntriples: 'application/n-triples',
  nquads: 'application/n-quads',
  notation3: 'text/n3',
  rdfXml: 'application/rdf+xml',
  trig: 'application/trig',
  turtle: 'text/turtle',
}

formats.serializers.set(mediaTypes.jsonLd, new JsonLdSerializer())
formats.serializers.set(mediaTypes.notation3, new TurtleSerializer())
formats.serializers.set(mediaTypes.turtle, new TurtleSerializer())
formats.serializers.set(mediaTypes.trig, new TrigSerializer())
formats.serializers.set(mediaTypes.rdfXml, new RdfXmlSerializer())

formats.parsers.set(mediaTypes.notation3, new N3Parser())
formats.parsers.set(mediaTypes.turtle, new TrigParser())
formats.parsers.set(mediaTypes.trig, new TrigParser())
formats.parsers.set(mediaTypes.ntriples, new NQuadsParser())
formats.parsers.set(mediaTypes.nquads, new NQuadsParser())
