import toStream from 'string-to-stream'
import clownface from 'clownface'
import $rdf from '@zazuko/env-node'
import { expect } from 'chai'
import * as ns from '@tpluscode/rdf-ns-builders'
import getStream from 'get-stream'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
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
          const graph = await $rdf.fromFile(join(__dirname, `graphs/${file}`))

          // when
          const serialized = await getStream(
            serializers.import(format, graph.toStream())
          )
          const roundTrip = await $rdf
            .dataset()
            .import(parsers.import(format, toStream(serialized)))

          // then
          expect(roundTrip.toCanonical()).to.eq(graph.toCanonical())
        })
      }
    }

    roundTripCase('shacl-report.nq')
    roundTripCase('wikidata.ttl')
    roundTripCase('list-reused-single-element.ttl')
  })
})
