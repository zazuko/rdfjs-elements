/* global CodeMirror */
import { html, fixture, expect, nextFrame, oneEvent } from '@open-wc/testing'
import { quad, blankNode, namedNode } from '@rdf-esm/data-model'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { parsers, serializers } from '@rdfjs-elements/formats-pretty'

import '../rdf-editor.js'

const quads = [quad(blankNode(), namedNode('p'), blankNode())]
describe('RdfjsEditor', () => {
  it('parses content on blur', async () => {
    // given
    const el = await fixture(
      html`<rdf-editor format="application/ld+json"></rdf-editor> `
    )
    parsers.set('application/ld+json', quads)

    // when
    await el.__updateValue('foo')
    CodeMirror.signal(el.codeMirror.editor, 'blur')
    await oneEvent(el, 'quads-changed')

    // then
    expect(el.quads).to.deep.eq(quads)
  })

  it('parses content on blur only when contents have changed', async () => {
    // given
    const el = await fixture(
      html`<rdf-editor
        format="application/ld+json"
        .quads="${quads}"
      ></rdf-editor> `
    )
    await el.ready

    // when
    CodeMirror.signal(el.codeMirror.editor, 'blur')

    // then
    expect(el.quads).to.eq(quads)
  })

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
        html`<rdf-editor
          format="application/ld+json"
          .quads="${quads}"
        ></rdf-editor> `
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
        html`<rdf-editor
          format="application/ld+json"
          .quads="${quads}"
        ></rdf-editor> `
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
          .quads="${quads}"
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

    it('dispatches event when parser throws', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      parsers.set('foo/bar', new Error('Parsing fails'))
      el.__parse()

      // when
      const {
        detail: { error },
      } = await oneEvent(el, 'parsing-failed')

      // then
      expect(error).to.be.a('Error')
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
      await oneEvent(el, 'serialized')

      // then
      expect(el.codeMirror.editor.getValue()).to.equal('foo bar')
      expect(el.serialized).to.equal('foo bar')
    })

    it('nicely stringifies JSON-LD', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="application/ld+json"></rdf-editor>`
      )
      await el.ready
      serializers.set('application/ld+json', '{ "foo": "bar" }')

      // when
      el.quads = []
      await oneEvent(el, 'serialized')

      // then
      expect(el.serialized).to.equal(JSON.stringify({ foo: 'bar' }, null, 2))
    })

    it('dispatches event when serializing is done', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      serializers.set('foo/bar', 'foo bar')

      // when
      const serializedEvent = oneEvent(el, 'serialized')
      el.quads = []
      const {
        detail: { value },
      } = await serializedEvent

      // then
      expect(value).to.equal('foo bar')
    })

    it('serializes using default+additional prefixes', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor
          format="foo/bar"
          prefixes="schema,dcterms"
        ></rdf-editor>`
      )
      await el.ready
      serializers.set('foo/bar', 'foo bar')

      // when
      el.quads = []
      await oneEvent(el, 'serialized')

      // then
      expect(serializers.lastImport.options.prefixes).to.have.property(
        'schema',
        'http://schema.org/'
      )
      expect(serializers.lastImport.options.prefixes).to.have.property(
        'dcterms',
        'http://purl.org/dc/terms/'
      )
    })

    it('setter ignore falsy value', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="foo/bar" .quads="${quads}"></rdf-editor>`
      )
      await el.ready

      // when
      el.quads = undefined

      // then
      expect(el.quads).to.eq(quads)
    })
  })

  describe('.readonly', () => {
    it('should toggle the code mirror setting when set to false', async () => {
      // given
      const editor = await fixture(
        html`<rdf-editor readonly format="foo/bar"></rdf-editor>`
      )

      // when
      editor.readonly = false
      await editor.updateComplete

      // then
      expect(editor.codeMirror.editor.getOption('readOnly')).to.be.false
    })

    it('should toggle the code mirror setting when set to true', async () => {
      // given
      const editor = await fixture(
        html`<rdf-editor format="foo/bar"></rdf-editor>`
      )

      // when
      editor.readonly = true
      await editor.updateComplete

      // then
      expect(editor.codeMirror.editor.getOption('readOnly')).to.be.true
    })

    it('should reflect attribute', async () => {
      // given
      const editor = await fixture(
        html`<rdf-editor format="foo/bar"></rdf-editor>`
      )

      // when
      editor.readonly = true
      await editor.updateComplete

      // then
      expect(editor).dom.to.equalSnapshot()
    })
  })

  describe('.prefixes', () => {
    it('setting triggers serialization', async () => {
      // given
      const el = await fixture(
        html`<rdf-editor format="foo/bar" .quads="${quads}"></rdf-editor>`
      )
      await el.ready
      serializers.set('foo/bar', 'after')

      // when
      el.prefixes = 'schema'
      await oneEvent(el, 'serialized')

      // then
      expect(el.codeMirror.editor.getValue()).to.equal('after')
      expect(el.serialized).to.equal('after')
    })

    it('setting does not serialize when dataset is empty', async () => {
      // given
      const el = await fixture(html`<rdf-editor format="foo/bar"></rdf-editor>`)
      await el.ready
      serializers.set('foo/bar', 'after')

      // when
      el.prefixes = 'schema'
      await nextFrame()

      // then
      expect(el.codeMirror.editor.getValue()).to.equal('')
      expect(el.serialized).to.be.undefined
    })
  })
})
