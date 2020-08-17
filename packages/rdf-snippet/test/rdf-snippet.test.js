import { html, fixture, expect } from '@open-wc/testing'

import '../rdf-snippet.js'

describe('RdfSnippet', () => {
  it('sets inner text as default editor contents', async () => {
    // given
    const turtle = `@prefix schema: <http://schema.org/> .`
    const snippet = await fixture(html`<rdf-snippet>
      <script type="text/turtle">
        ${turtle}
      </script>
    </rdf-snippet>`)

    // then
    expect(snippet._editor.serialized).to.eq(turtle)
  })

  it('sets initial editor contents from property', async () => {
    // given
    const turtle = `@prefix schema: <http://schema.org/> .`
    const snippet = await fixture(
      html`<rdf-snippet
        .input="${turtle}"
        input-format="text/turtle"
      ></rdf-snippet>`
    )

    // then
    expect(snippet._editor.serialized).to.eq(turtle)
  })

  it('should be read-only by default', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet></rdf-snippet>`)

    // then
    expect(snippet._editor.readonly).to.be.true
  })

  it('sets the default initial editor format', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet></rdf-snippet>`)

    // then
    expect(snippet._editor.format).to.eq('text/turtle')
  })

  it('sets the initial editor format as set on element', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet>
      <script type="application/n-triples"></script>
    </rdf-snippet>`)

    // then
    expect(snippet._editor.format).to.eq('application/n-triples')
  })

  it('renders list items for every displayed format', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet
      formats="application/ld+json, text/turtle"
    >
      <script type="application/rdf+xml"></script>
    </rdf-snippet>`)

    // then
    expect(snippet._outputFormats).to.deep.equal([
      'application/ld+json',
      'text/turtle',
    ])
    expect(snippet).shadowDom.to.equalSnapshot()
  })

  it('gets input format from script attribute', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet>
      <script type="application/rdf+xml"></script>
    </rdf-snippet>`)

    // then
    expect(snippet.inputFormat).to.equal('application/rdf+xml')
  })

  it('excludes input format from output formats', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet
      formats="application/rdf+xml"
    >
      <script type="application/rdf+xml"></script>
    </rdf-snippet>`)

    // then
    expect(snippet._outputFormats).to.have.length(0)
  })

  it('switching output changes the output editor format', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet
      formats="application/ld+json"
    >
      <script type="application/rdf+xml"></script>
    </rdf-snippet>`)

    // when
    snippet.renderRoot.querySelector('li[output]').click()
    await snippet.updateComplete

    // then
    expect(snippet).shadowDom.to.equalSnapshot()
    expect(snippet.show).to.equal('output')
  })
})
