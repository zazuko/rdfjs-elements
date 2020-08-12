import { html, fixture, expect } from '@open-wc/testing'

import '../rdf-editor.js'

describe('RdfjsEditor', () => {
  describe('format', () => {
    it('setting via property set code mirror mode', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor> `
      )
      await el.ready

      // when
      el.format = 'text/turtle'

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

      // then
      expect(el.codeMirror.editor.getMode().name).to.equal('turtle')
    })
  })
})
