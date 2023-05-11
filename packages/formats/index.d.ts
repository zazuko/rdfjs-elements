import { Stream, Sink } from '@rdfjs/types'
import type { SinkMap } from '@rdfjs/sink-map'
import { EventEmitter } from 'events';
import type { Environment } from '@rdfjs/Environment/Environment.js';

export const mediaTypes: {
  jsonLd: 'application/ld+json',
  ntriples: 'application/n-triples',
  nquads: 'application/n-quads',
  notation3: 'text/n3',
  rdfXml: 'application/rdf+xml',
  trig: 'application/trig',
  turtle: 'text/turtle',
}

interface SinkConstructor<I extends EventEmitter, O extends EventEmitter> {
  new (arg?: { factory: Environment<any> }): Sink<I, O>;
}

export const TurtleSerializer: SinkConstructor<EventEmitter, Stream>
export const RdfXmlSerializer: SinkConstructor<EventEmitter, Stream>
export const TrigSerializer: SinkConstructor<EventEmitter, Stream>
export const JsonLdSerializer: SinkConstructor<EventEmitter, Stream>
export const TrigParser: SinkConstructor<Stream, EventEmitter>
export const NQuadsParser: SinkConstructor<Stream, EventEmitter>

declare const formats: {
  serializers: SinkMap<EventEmitter, Stream>
  parsers: SinkMap<Stream, EventEmitter>
}

export default formats
