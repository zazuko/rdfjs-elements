import toStream from 'string-to-stream'
import clownface from 'clownface'
import $rdf from '@zazuko/env-node'
import { expect } from 'chai'
import * as ns from '@tpluscode/rdf-ns-builders'
import getStream from 'get-stream'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Transform } from 'readable-stream'
import formats, { mediaTypes } from '../index.js'

const { parsers, serializers } = formats
const __dirname = dirname(fileURLToPath(import.meta.url))

describe('@rdfjs-elements/formats-pretty', () => {
  describe('parsers', () => {
    describe('trig', () => {
      it('forwards the options param to underlying parser', async () => {
        // given
        const input = `graph <> {
  <> a <Bar> .
}`

        // when
        const quads = parsers.import(mediaTypes.trig, toStream(input), {
          baseIRI: 'https://example.com/foo/',
        })
        const dataset = await $rdf.dataset().import(quads)

        // then
        const term = $rdf.namedNode('https://example.com/foo/')
        const pointer = clownface({
          dataset,
          graph: term,
        })
        expect(
          pointer
            .node(term)
            .out(ns.rdf.type)
            .term.equals($rdf.namedNode('https://example.com/foo/Bar'))
        )
      })
    })

    describe('n3', () => {
      it('parses a N3 document with rules', async () => {
        // given
        const input = `{
  ?s a ?o .
  ?o <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?o2 .
} => {
  ?s a ?o2 .
} .`

        // when
        const quads = parsers.import(mediaTypes.notation3, toStream(input))
        const dataset = await $rdf.dataset().import(quads)

        // then
        expect(dataset.size).to.eq(4)
      })
    })
  })

  describe('serializers', () => {
    describe('trig', () => {
      it('produces output', async () => {
        // given
        const dataset = $rdf.dataset()
        const john = $rdf.namedNode('https://example.com/john')
        clownface({ dataset, graph: john })
          .namedNode(john)
          .addOut(ns.dcterms.type, ns.schema.Person)

        // when
        const serialized = await getStream(
          serializers.import(mediaTypes.trig, dataset.toStream())
        )

        // then
        expect(serialized).to.contain('<https://example.com/john> {')
      })
    })
  })

  describe('round-trips', () => {
    function roundTripCase(file) {
      for (const format of Object.values(mediaTypes)) {
        it(`graph ${file} in format ${format}`, async () => {
          // given
          const data = await $rdf
            .dataset()
            .import($rdf.fromFile(join(__dirname, `graphs/${file}`)))

          // when
          const serialized = await getStream(
            serializers.import(format, data.toStream())
          )
          const parserStream = parsers
            .import(format, toStream(serialized))
            .pipe(
              new Transform({
                objectMode: true,
                transform({ subject, predicate, object, graph }, _, callback) {
                  callback(null, $rdf.quad(subject, predicate, object, graph))
                },
              })
            )
          const roundTrip = await $rdf.dataset().import(parserStream)

          // then
          expect(roundTrip.toCanonical()).to.eq(data.toCanonical())
        })
      }
    }

    roundTripCase('shacl-report.nq')
    roundTripCase('wikidata.ttl')
    roundTripCase('list-reused-single-element.ttl')
  })
})
