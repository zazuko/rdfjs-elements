import { html, fixture, expect, assert } from '@open-wc/testing'
import { nextFrame } from '@open-wc/testing-helpers'
import { parsers, serializers } from '@rdfjs-elements/testing/formats-common'
import { quad, blankNode } from '@rdf-esm/data-model'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'

import '../rdf-editor.js'

describe('RdfjsEditor', () => {
  describe('.format', () => {
    it('setting via property set code mirror mode', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor> `
      )
      await el.ready

      // when
      el.format = 'text/turtle'
      await nextFrame()

      // then
      expect(el.codeMirror.editor.getMode().name).to.equal('turtle')
    })

    it('setting via property set code mirror mode', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor> `
      )
      await el.ready

      // when
      el.format = 'text/turtle'
      await nextFrame()

      // then
      expect(el.codeMirror.editor.getMode().name).to.equal('turtle')
    })

    it('setting via property reflects attribute', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor> `
      )
      await el.ready

      // when
      el.format = 'text/turtle'
      await nextFrame()
      await el.updateComplete

      // then
      expect(el.getAttribute('format')).to.equal('text/turtle')
    })

    it('setting via attribute set code mirror mode', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor> `
      )
      await el.ready

      // when
      el.setAttribute('format', 'text/turtle')
      await nextFrame()

      // then
      expect(el.codeMirror.editor.getMode().name).to.equal('turtle')
    })
  })

  describe('.quads', () => {
    it('get rejects if parser is not found', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready

      // then
      await el.quads
        .then(() => assert.fail())
        .catch(e => {
          expect(e.message).to.contain('No parser')
        })
    })

    it('gets quads coming from parser', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      const expected = [quad(blankNode(), rdf.type, schema.Person)]
      parsers.set('foo/bar', expected)

      // when
      const quads = await el.quads

      // then
      expect(quads).to.deep.eq(expected)
    })

    it('sets serialized string to the editor', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      serializers.set('foo/bar', 'foo bar')

      // when
      el.quads = []
      await nextFrame()
      await el.updateComplete

      // then
      expect(el.serialized).to.equal('foo bar')
    })
  })
})
