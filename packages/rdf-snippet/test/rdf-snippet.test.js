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

    await snippet._editor.ready

    // then
    expect(snippet._editor.value).to.eq(turtle)
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

    await snippet._editor.ready

    // then
    expect(snippet._editor.value).to.eq(turtle)
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

  it('uses all known output formats by default', async () => {
    // given
    const snippet = await fixture(html`<rdf-snippet>
      <script type="application/n-triples"></script>
    </rdf-snippet>`)

    // then
    expect(snippet.formats).not.to.eq('')
    expect(snippet.getAttribute('formats')).not.to.eq('')
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
    snippet._showOutput('application/ld+json')()
    await snippet.updateComplete

    // then
    expect(snippet).shadowDom.to.equalSnapshot()
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
    snippet._showInput()
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

  describe('[only-output]', () => {
    it('does not exclude input from output formats', async () => {
      // given
      const snippet = await fixture(html`<rdf-snippet
        formats="application/rdf+xml"
        only-output
      >
        <script type="application/rdf+xml"></script>
      </rdf-snippet>`)

      // then
      expect(snippet._outputFormats).to.have.length(1)
    })

    it('does not render input format button', async () => {
      // given
      serializers.set('text/n3', 'n3')
      const snippet = await fixture(html`<rdf-snippet
        only-output
        formats="text/n3"
      >
        <script type="application/rdf+xml">
          rdf-xml
        </script>
      </rdf-snippet>`)

      // then
      const input = snippet.renderRoot.querySelector('li[input]')
      const selectedOutput = snippet.renderRoot.querySelector(
        'li[output][part~=selected]'
      )
      expect(input).to.be.null
      expect(selectedOutput).not.to.be.null
    })
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

      // then
      expect(snippet.value).to.equal('input')
    })
  })
})
