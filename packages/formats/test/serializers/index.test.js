import { expect } from 'chai'
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import * as ns from '@tpluscode/rdf-ns-builders'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import getStream from 'get-stream'
import { turtle, jsonld } from '../../serializers/index.js'

describe('@rdfjs-elements/formats-pretty/serializers', () => {
  describe('turtle', () => {
    it('combines default and import prefixes', async () => {
      // given
      const { dcterms, schema } = prefixes
      const sink = await turtle({
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
  })

  describe('jsonld', () => {
    it('combines default and import prefixes', async () => {
      // given
      const { dcterms, schema } = prefixes
      const sink = await jsonld({
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
