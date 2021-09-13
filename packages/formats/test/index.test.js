import toStream from 'string-to-stream'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { rdf } from '@tpluscode/rdf-ns-builders/strict'
import { parsers } from '../index.js'

describe('@rdfjs-elements/formats-pretty', () => {
  describe('parsers', () => {
    describe('trig', () => {
      it('forwards the options param to underlying parser', async () => {
        // given
        const input = `graph <> {
  <> a <Bar> .
}`

        // when
        const quads = parsers.import('application/trig', toStream(input), {
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
            .out(rdf.type)
            .term.equals($rdf.namedNode('https://example.com/foo/Bar'))
        )
      })
    })
  })
})
