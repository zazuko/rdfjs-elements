import type { Sink, Stream } from '@rdfjs/types'
import type { EventEmitter } from 'events'

interface SerializerDefaults {
  prefixes?: Record<string, string>
}

interface SinkFactory {
  (defaults?: SerializerDefaults): Promise<Sink<Stream, EventEmitter>>
}

export const turtle: SinkFactory
export const rdfXml: SinkFactory
export const trig: SinkFactory
export const jsonld: SinkFactory
