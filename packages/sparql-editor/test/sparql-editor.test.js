import { expect, fixture, html, oneEvent } from '@open-wc/testing'
import '../sparql-editor.js'

describe('SparqlEditor', () => {
  it('parses query with base from element property', async () => {
    // given
    const value = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }'
    const el = await fixture(
      html`<sparql-editor
        base-iri="http://foo.bar/"
        .value="${value}"
      ></sparql-editor>`
    )

    // when
    const { detail } = await oneEvent(el, 'parsed')

    // then
    expect(detail.value).to.match(/BASE <http:\/\/foo\.bar\//)
    expect(detail.query.queryType).to.eq('CONSTRUCT')
  })

  it('parses query with prefixes provided as element attribute', async () => {
    // given
    const value = 'SELECT * WHERE { ?s a schema:Person ; foaf:name ?name }'
    const el = await fixture(
      html`<sparql-editor
        prefixes="schema,foaf"
        .value="${value}"
      ></sparql-editor>`
    )

    // when
    await oneEvent(el, 'parsed')
    const { detail } = await oneEvent(el, 'parsed')

    // then
    expect(detail.query.queryType).to.eq('SELECT')
  })

  it('parses query with custom prefixes', async () => {
    // given
    const value = 'SELECT * WHERE { ?s a schema:Person ; foaf:name ?name }'
    const prefixes = {
      schema: 'http://schema.org/',
    }
    const el = await fixture(
      html`<sparql-editor
        prefixes="foaf"
        .customPrefixes="${prefixes}"
        .value="${value}"
      ></sparql-editor>`
    )

    // when
    await oneEvent(el, 'parsed')
    const { detail } = await oneEvent(el, 'parsed')

    // then
    expect(detail.query.queryType).to.eq('SELECT')
  })

  it('parses when value is set', async () => {
    // given
    const el = await fixture(
      html`<sparql-editor prefixes="schema,foaf"></sparql-editor>`
    )

    // when
    el.value = 'SELECT * WHERE { ?s ?p ?o }'
    const { detail } = await oneEvent(el, 'parsed')

    // then
    expect(detail.query.queryType).to.eq('SELECT')
  })

  it('updates CodeMirror when value is set', async () => {
    // given
    const el = await fixture(html`<sparql-editor></sparql-editor>`)

    // when
    await el.ready
    el.value = 'SELECT * WHERE { ?s ?p ?o }'

    // then
    expect(el.codeMirror.editor.getValue()).to.eq('SELECT * WHERE { ?s ?p ?o }')
  })

  it('dispatches event when parsing fails', async () => {
    // given
    const value = 'SELECT { ?s ?p ?o } WHERE { ?s ?p ?o }'
    const el = await fixture(
      html`<sparql-editor .value="${value}"></sparql-editor>`
    )

    // when
    const { detail } = await oneEvent(el, 'parsing-failed')

    // then
    expect(detail.error).to.be.ok
  })

  it('highlights text when parsing fails', async () => {
    // given
    const value = 'SELECT { ?s ?p ?o } WHERE { ?s ?p ?o }'
    const el = await fixture(
      html`<sparql-editor .value="${value}"></sparql-editor>`
    )

    // when
    await oneEvent(el, 'parsing-failed')

    // then
    expect(el.shadowRoot.querySelector('[part=error]')).to.be.ok
  })

  it('removes highlight text when parsing succeeds', async () => {
    // given
    const value = 'SELECT { ?s ?p ?o } WHERE { ?s ?p ?o }'
    const el = await fixture(
      html`<sparql-editor .value="${value}"></sparql-editor>`
    )
    await oneEvent(el, 'parsing-failed')

    // when
    el.value = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }'
    await oneEvent(el, 'parsed')

    // then
    expect(el.shadowRoot.querySelector('[part=error]')).to.be.null
  })
})
