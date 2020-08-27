import { html, fixture, expect, oneEvent } from '@open-wc/testing'
import { serializers } from '@rdfjs-elements/rdf-editor/formats.js'

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
  })

  it('switching to output raises event', async () => {
    // given
    serializers.set('text/n3', 'n3')
    const snippet = await fixture(html`<rdf-snippet formats="text/n3">
      <script type="application/rdf+xml"></script>
    </rdf-snippet>`)

    // when
    const changeEvent = oneEvent(snippet, 'value-changed')
    snippet.renderRoot.querySelector('li[output]').click()
    const {
      detail: { value },
    } = await changeEvent

    // then
    expect(value).to.equal('n3')
  })

  it('switching to input raises event', async () => {
    // given
    serializers.set('text/n3', 'n3')
    const snippet = await fixture(html`<rdf-snippet formats="text/n3">
      <script type="application/rdf+xml">
        rdf-xml
      </script>
    </rdf-snippet>`)
    const changeToOutput = oneEvent(snippet, 'value-changed')
    snippet.renderRoot.querySelector('li[output]').click()
    await changeToOutput

    // when
    const changeToInput = oneEvent(snippet, 'value-changed')
    snippet.renderRoot.querySelector('li[input]').click()
    const {
      detail: { value },
    } = await changeToInput

    // then
    expect(value).to.equal('rdf-xml')
  })

  describe('.value', () => {
    it('gets the input contents when input is shown', async () => {
      // given
      const snippet = await fixture(html`<rdf-snippet
        formats="application/ld+json"
      >
        <script type="application/rdf+xml">
          input
        </script>
      </rdf-snippet>`)

      // when
      await snippet.updateComplete
      const { value } = snippet

      // then
      expect(value).to.equal('input')
    })

    it('gets the output contents when output is shown', async () => {
      // given
      serializers.set('text/n3', 'notation 3')
      const snippet = await fixture(html`<rdf-snippet formats="text/n3">
        <script type="application/rdf+xml">
          rdf/xml
        </script>
      </rdf-snippet>`)

      // when
      snippet.renderRoot.querySelector('li[output]').click()
      await oneEvent(
        snippet.renderRoot.querySelector('rdf-editor#output'),
        'serialized'
      )
      const { value } = snippet

      // then
      expect(value).to.equal('notation 3')
    })
  })
})
