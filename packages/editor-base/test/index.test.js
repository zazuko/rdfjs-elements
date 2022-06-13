import { expect, fixture, html } from '@open-wc/testing'
import EditorBase from '../index.js'

customElements.define('test-editor', EditorBase)

describe('@rdfjs-elements/editor-base', () => {
  describe('autoRefresh', () => {
    it('is enabled by default', async () => {
      // given
      const el = await fixture(html`<test-editor></test-editor>`)
      await el.ready

      // then
      expect(el.codeMirror.editor.getOption('autoRefresh')).to.be.true
    })

    it('can be configured with delay property', async () => {
      // given
      const el = await fixture(
        html`<test-editor .autoRefresh="${500}"></test-editor>`
      )
      await el.ready

      // then
      expect(el.codeMirror.editor.getOption('autoRefresh')).to.deep.eq({
        delay: 500,
      })
    })

    it('can be configured with delay attribute', async () => {
      // given
      const el = await fixture(
        html`<test-editor auto-refresh="1000"></test-editor>`
      )
      await el.ready

      // then
      expect(el.codeMirror.editor.getOption('autoRefresh')).to.deep.eq({
        delay: 1000,
      })
    })
  })
})
