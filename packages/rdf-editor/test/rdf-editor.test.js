import { html, fixture, expect, nextFrame, oneEvent } from '@open-wc/testing'
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

    it('setting serializes quads in new format', async () => {
      // given
      const before = 'foo'
      const after = 'bar'
      const el = await fixture(
        html`<rdf-editor
          format="application/ld+json"
          .serialized="${before}"
        ></rdf-editor>`
      )
      await el.ready
      serializers.set('text/turtle', after)

      // when
      el.format = 'text/turtle'

      // then
      el.codeMirror.editor.on('change', value => {
        expect(value).to.equal('bar')
      })
    })
  })

  describe('.quads', () => {
    it('dispatches event when parser is not found', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      el.__parse()

      // when
      const {
        detail: { notFound },
      } = await oneEvent(el, 'parsing-failed')

      // then
      expect(notFound).to.eq(true)
    })

    it('gets quads coming from parser', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      const expected = [quad(blankNode(), rdf.type, schema.Person)]
      parsers.set('foo/bar', expected)
      el.__parse()

      // when
      const { detail } = await oneEvent(el, 'quads-changed')

      // then
      expect(el.quads).to.deep.eq(expected)
      expect(detail.value).to.deep.eq(expected)
    })

    it('sets serialized string to the editor', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      serializers.set('foo/bar', 'foo bar')

      // when
      el.quads = []

      // then
      el.codeMirror.editor.on('change', value => {
        expect(value).to.equal('foo bar')
      })
    })
  })
})
