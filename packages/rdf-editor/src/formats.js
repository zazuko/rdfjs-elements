import * as formatsCommon from '@rdf-esm/formats-common'
import { SinkMap } from '@rdf-esm/sink-map'
import * as graphy from './serializers/graphy.js'
import jsonld from './serializers/jsonld.js'

export const serializers = new SinkMap([...formatsCommon.serializers])
export const parsers = new SinkMap([...formatsCommon.parsers])

export const formats = {
  jsonLd: 'application/ld+json',
  ntriples: 'application/n-triples',
  nquads: 'application/n-quads',
  notation3: 'text/n3',
  rdfXml: 'application/rdf+xml',
  trig: 'application/trig',
  turtle: 'text/turtle',
}

serializers.set(formats.jsonLd, jsonld)
serializers.set(formats.notation3, graphy.turtle)
serializers.set(formats.turtle, graphy.turtle)
serializers.set(formats.trig, graphy.trig)
// serializers.set(formats.rdfXml, graphy.rdfXml) TODO: uncomment when fixed in blake-regalia/graphy.js#
