import chai, { expect } from 'chai'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import prefixes from '@zazuko/prefixes'
import * as ns from '@tpluscode/rdf-ns-builders'
import $rdf from '@zazuko/env-node'
import clownface from 'clownface'
import getStream from 'get-stream'
import { fromFile } from '@zazuko/rdf-utils-fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import JsonldSerializer from '../../serializers/jsonld.js'
import { TurtleSerializer } from '../../serializers/graphy.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('@rdfjs-elements/formats-pretty/serializers', () => {
  chai.use(jestSnapshotPlugin())

  describe('turtle', () => {
    it('combines default and import prefixes', async () => {
      // given
      const { dcterms, schema } = prefixes
      const sink = new TurtleSerializer({
        prefixes: { schema },
      })
      const dataset = $rdf.dataset()
      clownface({ dataset })
        .namedNode('https://example.com/john')
        .addOut(ns.dcterms.type, ns.schema.Person)

      // when
      const serialized = await getStream(
        sink.import(dataset.toStream(), {
          prefixes: { dcterms },
        })
      )

      // then
      expect(serialized).to.contain(`prefix schema: <${schema}>`)
      expect(serialized).to.contain(`prefix dcterms: <${dcterms}>`)
      expect(serialized).to.contain(`dcterms:type schema:Person`)
    })

    it('removes excess rdf List node properties by default', async () => {
      // given
      const { owl, as } = prefixes
      const graph = fromFile(
        $rdf,
        join(__dirname, `../graphs/list-with-extras.ttl`)
      )
      const sink = new TurtleSerializer({
        prefixes: { owl, as },
      })

      // when
      const serialized = await getStream(sink.import(graph))

      // then
      expect(serialized).to.match(/owl:unionOf \(\s+as:Object\s+as:Link\s+\)/m)
    })

    it('does not remove excess rdf List node properties when option set', async () => {
      // given
      const { owl, as, rdf, rdfs } = prefixes
      const graph = fromFile(
        $rdf,
        join(__dirname, `../graphs/list-with-extras.ttl`)
      )
      const sink = new TurtleSerializer({
        prefixes: { owl, as, rdf, rdfs },
      })

      // when
      const serialized = await getStream(
        sink.import(graph, { preserveListNodeProperties: true })
      )

      // then
      expect(serialized).to.match(
        /rdf:first as:Object ;\s+rdf:type rdfs:Resource, rdf:List ;/m
      )
      expect(serialized).to.match(
        /rdf:first as:Link ;\s+rdf:type rdf:List ;\s+rdf:rest rdf:nil ;/m
      )
    })

    it('serializes successfully a complex graph with reused nodes', async () => {
      // given
      const { owl, as, rdf, rdfs } = prefixes
      const graph = fromFile($rdf, join(__dirname, `../graphs/view.ttl`))
      const sink = new TurtleSerializer({
        prefixes: { owl, as, rdf, rdfs },
      })

      // when
      const serialized = await getStream(sink.import(graph))

      // then
      expect(serialized).to.be.ok
    })

    it('preserves line breaks in literals', async () => {
      // given
      const graph = fromFile(
        $rdf,
        join(__dirname, `../graphs/multiline-literals.ttl`)
      )
      const sink = new TurtleSerializer()

      // when
      const serialized = await getStream(sink.import(graph))

      // then
      expect(serialized).toMatchSnapshot()
    })

    it('preserves line breaks in literals when using prefixes', async () => {
      // given
      const graph = fromFile(
        $rdf,
        join(__dirname, `../graphs/multiline-literals.ttl`)
      )
      const sink = new TurtleSerializer({
        prefixes: {
          ex: 'http://example.org/',
        },
      })

      // when
      const serialized = await getStream(sink.import(graph))

      // then
      expect(serialized).toMatchSnapshot()
    })
  })

  describe('jsonld', () => {
    it('combines default and import prefixes', async () => {
      // given
      const { dcterms, schema } = prefixes
      const sink = new JsonldSerializer({
        prefixes: { schema },
      })
      const dataset = $rdf.dataset()
      clownface({ dataset })
        .namedNode('https://example.com/john')
        .addOut(ns.dcterms.type, ns.schema.Person)

      // when
      const serialized = await getStream(
        sink.import(dataset.toStream(), {
          prefixes: { dcterms },
        })
      )

      // then
      const json = JSON.parse(serialized)
      expect(json).to.deep.include({
        '@context': {
          schema,
          dcterms,
        },
      })
      expect(json).to.have.deep.property('dcterms:type', {
        '@id': 'schema:Person',
      })
    })
  })
})
