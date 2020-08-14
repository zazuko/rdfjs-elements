import { css, html, LitElement } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'

import '@rdfjs-elements/rdf-editor'

const Quads = Symbol('quads')

const formatLabels = {
  'text/turtle': 'Turtle',
  'application/ld+json': html`JSON&#8209;LD`,
  'application/trig': 'TriG',
  'application/n-quads': html`N&#8209;Quads`,
  'application/n-triples': html`N&#8209;Triples`,
  'text/n3': 'Notation3',
  'application/rdf+xml': 'RDF/XML',
}

/**
 * An RDF viewer which allows switching between various serializations.
 *
 * ## Usage
 *
 * The initial text of the RDF snippet must be added inside a child `<script>` element with `type` attribute set to the appropriate
 * RDF media type. The element's `formats` property selects the media types which should be available as alternative serializations.
 *
 * ```html
 * <rdf-snippet formats="application/ld+json,application/n-quads">
 *   <script type="text/turtle">
 * (at)base <http://example.com/> .
 * (at)prefix schema: <http://schema.org/> .
 *
 * <john> a schema:Person ;
 *   schema:name "John Doe" .
 *   </script>
 * </rdf-snippet>
 * ```
 *
 * The initial RDF representation remains unchanged, while selecting the output formats re-serializes the actual triples and presents the output.
 *
 * ## Supported types
 *
 * Out of the box all common RDF formats are supported, where some can only be used for the input (no serializer available):
 *
 * - JSON-LD
 * - N-Triples
 * - N-Quads
 * - Turtle/N3
 * - TriG *(input only)*
 * - RDF/XML *(input only)*
 *
 * Support for additional types can be added by registering an RDF/JS-compliant parser and/or serializer using the [`@rdf-esm/formats-common`](https://npm.im/@rdf-esm/formats-common)
 * package:
 *
 * ```js
 * import { parsers, serializers } from '@rdf-esm/formats-common'
 *
 * // by importing dynamically, the code will only be loaded when needed
 * parsers.set('application/trix', async () => {
 *   const TrixParser = await import('@hypothetical/trix-parser')
 *   return new TrixParser()
 * })
 *
 * serializers.set('application/trix', async () => {
 *   const TrixSerializer = await import('@hypothetical/trix-serializer')
 *   return new TrixSerializer()
 * })
 * ```
 *
 * @prop {string} formats - comma-separated list of output formats
 * @prop {"input"|"output"} show - gets a value indicating whether the input or editor is shown
 * @prop {string} selectedFormat - gets the selected output format
 *
 * @attr {"vertical"|"horizontal"} layout - controls the position of selection buttons
 */
export class RdfSnippet extends LitElement {
  static get properties() {
    return {
      formats: { type: String },
      _input: { type: String },
      selectedFormat: { type: String, attribute: false },
      show: { type: String },
      layout: { type: String, reflect: true },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      #wrapper {
        display: flex;
        flex-direction: column;
      }

      :host([layout='vertical']) #wrapper {
        flex-direction: row;
      }

      ol {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
      }

      :host([layout='vertical']) ol {
        flex-direction: column;
      }

      li {
        list-style: none;
        cursor: pointer;
        padding: 10px;
        margin: 2px;
        border: solid 1px black;
      }

      li[selected] {
        text-decoration: underline;
      }

      rdf-editor:not([visible]) {
        display: none;
      }
    `
  }

  get _editor() {
    return this.renderRoot.querySelector('#input')
  }

  get _outputFormats() {
    const formats = this.formats.split(',').map(f => f.trim())
    const inputFormatInFormats = this.formats.indexOf(this.inputFormat)
    if (inputFormatInFormats >= 0) {
      formats.splice(inputFormatInFormats, 1)
    }
    return formats
  }

  constructor() {
    super()
    this.formats = ''
    this[Quads] = []
    this.show = 'input'
  }

  connectedCallback() {
    super.connectedCallback()

    const contentScript = this.querySelector('script')
    this.inputFormat = contentScript?.getAttribute('type') || 'text/turtle'
    this._input = contentScript?.textContent.trim()
    ;[this.selectedFormat] = this._outputFormats
  }

  render() {
    return html`<div id="wrapper">
      <ol>
        ${this._renderButtons()}
      </ol>
      <rdf-editor
        id="input"
        readonly
        .serialized="${this._input}"
        .format="${this.inputFormat}"
        ?visible="${this.show === 'input'}"
      ></rdf-editor>
      <rdf-editor
        readonly
        .quads="${this[Quads]}"
        .format="${this.selectedFormat}"
        ?visible="${this.show === 'output'}"
      ></rdf-editor>
    </div>`
  }

  _renderButtons() {
    return html` <li
        input
        ?selected="${this.show === 'input'}"
        @click="${this._showInput}"
      >
        ${formatLabels[this.inputFormat] || this.inputFormat}
      </li>
      ${repeat(
        this._outputFormats,
        format => html`<li
          output
          ?selected="${this.show === 'output' &&
          this.selectedFormat === format}"
          @click="${this._showOutput(format)}"
        >
          ${formatLabels[format] || format}
        </li>`
      )}`
  }

  _showInput() {
    this.show = 'input'
  }

  _showOutput(format) {
    return async () => {
      if (!this[Quads].length) {
        await this._editor.updateComplete
        this[Quads] = this._editor.quads
      }
      this.selectedFormat = format
      this.show = 'output'
    }
  }
}
