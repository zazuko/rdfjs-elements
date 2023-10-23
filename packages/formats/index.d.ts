import { Stream, Sink } from '@rdfjs/types'
import { EventEmitter } from 'events';
import type { Environment } from '@rdfjs/environment/Environment.js';
import type Formats from '@rdfjs/environment/lib/Formats.js';

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

declare const formats: Pick<Formats, 'parsers' | 'serializers'>

export default formats
