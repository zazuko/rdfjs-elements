import { css, html, LitElement } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { mediaTypes } from '@rdfjs-elements/rdf-editor/index.js'

import '@rdfjs-elements/rdf-editor'

const Quads = Symbol('quads')
const PreviousOutputFormat = Symbol('previous output')
const Show = Symbol('Shown editor')

const formatLabels = {
  [mediaTypes.turtle]: 'Turtle',
  [mediaTypes.jsonLd]: html`JSON&#8209;LD`,
  [mediaTypes.trig]: 'TriG',
  [mediaTypes.nquads]: html`N&#8209;Quads`,
  [mediaTypes.ntriples]: html`N&#8209;Triples`,
  [mediaTypes.notation3]: 'Notation3',
  [mediaTypes.rdfXml]: 'RDF/XML',
}

/**
 * An RDF viewer which allows switching between various serializations.
 *
 * ## Default usage
 *
 * The initial text of the RDF snippet must be added inside a child `<script>` element with `type` attribute set to the appropriate
 * RDF media type. The element's `formats` property selects the media types which should be available as alternative serializations.
 *
 * ```html
 * <rdf-snippet formats="application/ld+json,application/n-quads">
 *   <script type="text/turtle">
 * ＠base <http://example.com/> .
 * ＠prefix schema: <http://schema.org/> .
 *
 * <john> a schema:Person ;
 *   schema:name "John Doe" .
 *   </script>
 * </rdf-snippet>
 * ```
 *
 * The initial RDF representation remains unchanged, while selecting the output formats re-serializes the actual triples and presents the output.
 *
 * ## Usage with properties
 *
 * In case when a `<script>` cannot be used, the snippet can be initialized by passing the serialized input and input format using properties/attributes
 *
 * ```html
 * <rdf-snippet .input="${turtle}" input-format="text/turtle">
 * </rdf-snippet>
 * ```
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
 * Support for additional types can be added by registering an RDF/JS-compliant parser and/or serializer using the [`@rdfjs/formats-common`](https://npm.im/@rdfjs/formats-common)
 * package.
 *
 * @prop {string} formats - comma-separated list of output formats
 * @prop {string} selectedFormat - gets the selected output format
 * @prop {string} input - set the input serialized value (ignored when `<script>` is used)
 * @prop {string} inputFormat - set the format of the input (ignored when `<script>` is used)
 * @prop {string} prefixes - a comma-separated list of prefixes to use for serializing. Any prefix included in the [`@zazuko/vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used
 * @prop {boolean} onlyOutput - hides the input editor and only shows the outputs
 * @attr {"vertical"|"horizontal"} layout - controls the position of selection buttons
 *
 * @csspart format - every format selection button
 * @csspart input - selection button for the input format
 * @csspart output - selection button for the output formats
 * @csspart selected - the currently selected format button
 *
 * @event {CustomEvent<{ value: Quad[] }>} quads-changed - dispatched when the input quads are parsed
 */
export class RdfSnippet extends LitElement {
  static get properties() {
    return {
      formats: { type: String, reflect: true },
      input: { type: String, attribute: false },
      inputFormat: { type: String, attribute: 'input-format' },
      selectedFormat: { type: String, attribute: false },
      layout: { type: String, reflect: true },
      prefixes: { type: String },
      onlyOutput: { type: Boolean, attribute: 'only-output' },
      customPrefixes: { type: Object },
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

      li[part$='selected'] {
        text-decoration: underline;
      }

      rdf-editor {
        flex: 1;
      }

      rdf-editor,
      #wrapper {
        height: 100%;
      }

      rdf-editor:not([visible]) {
        display: none;
      }
    `
  }

  /**
   * Gets the text contents of the currently showing editor
   *
   * @return {string}
   */
  get value() {
    return this[Show] === 'input' ? this.input : this._outputEditor.value
  }

  get _editor() {
    return this.renderRoot.querySelector('#input')
  }

  get _outputEditor() {
    return this.renderRoot.querySelector('#output')
  }

  get _outputFormats() {
    const outputFormats = this.formats.split(',').map(f => f.trim())
    if (!this.onlyOutput) {
      const inputFormatInFormats = this.formats.indexOf(this.inputFormat)
      if (inputFormatInFormats >= 0) {
        outputFormats.splice(inputFormatInFormats, 1)
      }
    }
    return outputFormats
  }

  constructor() {
    super()
    this.formats = Object.values(mediaTypes).join(',')
    this.prefixes = ''
    this[Quads] = []
    this[Show] = 'input'
    this.inputFormat = 'text/turtle'
    this.customPrefixes = {}
  }

  connectedCallback() {
    super.connectedCallback()

    const contentScript = this.querySelector('script')
    if (contentScript) {
      this.inputFormat = contentScript.getAttribute('type') || 'text/turtle'
      this.input = contentScript.textContent.trim()
    }
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
        .value="${this.input}"
        .format="${this.inputFormat}"
        ?visible="${this[Show] === 'input' && !this.onlyOutput}"
        @quads-changed="${this.__inputParsed}"
      ></rdf-editor>
      <rdf-editor
        id="output"
        readonly
        .customPrefixes="${this.customPrefixes}"
        .prefixes="${this.prefixes}"
        .quads="${this[Quads]}"
        .format="${this.selectedFormat}"
        ?visible="${this[Show] === 'output'}"
        @serialized="${this.__dispatchChangeEvent}"
      ></rdf-editor>
    </div>`
  }

  async updated(_changedProperties) {
    super.updated(_changedProperties)
    if (
      _changedProperties.has('onlyOutput') &&
      this.onlyOutput &&
      this[Show] === 'input'
    ) {
      this._showOutput(this._outputFormats[0])()
    }
  }

  _renderButtons() {
    const inputFormatButton = () => {
      const inputParts = `format input ${
        this[Show] === 'input' ? 'selected' : ''
      }`

      return html`<li
        input
        part="${inputParts}"
        @click="${this._showInput}"
        @keydown="${this._onKey(this._showInput)}"
      >
        ${formatLabels[this.inputFormat] || this.inputFormat}
      </li>`
    }

    return html` ${this.onlyOutput ? '' : inputFormatButton()}
    ${repeat(this._outputFormats, this.__renderOutputButton.bind(this))}`
  }

  _onKey(cb) {
    const onKey = cb.bind(this)

    /**
     * @param {KeyboardEvent} e
     */
    return e => {
      if (e.key === 'Enter') {
        onKey(this)
      }
    }
  }

  async _showInput() {
    this[Show] = 'input'
    this.__dispatchChangeEvent()
    this[PreviousOutputFormat] = this.selectedFormat
    await this.requestUpdate()
    await this._editor.ready
    this._editor.codeMirror.editor.refresh()
  }

  _showOutput(format) {
    return async () => {
      this.selectedFormat = format
      this[Show] = 'output'
      if (format === this[PreviousOutputFormat]) {
        this.__dispatchChangeEvent()
      }
      this.requestUpdate()
    }
  }

  __inputParsed(e) {
    this[Quads] = e.detail.value
    this.requestUpdate()

    this.dispatchEvent(
      new CustomEvent('quads-changed', {
        detail: {
          value: this[Quads],
        },
      })
    )
  }

  __renderOutputButton(format) {
    const parts = `format output ${
      this[Show] === 'output' && this.selectedFormat === format
        ? 'selected'
        : ''
    }`

    return html`<li
      output
      part="${parts}"
      @click="${this._showOutput(format)}"
      @keydown="${this._onKey(this._showOutput(format))}"
    >
      ${formatLabels[format] || format}
    </li>`
  }

  __dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: {
          value: this.value,
        },
      })
    )
  }
}
