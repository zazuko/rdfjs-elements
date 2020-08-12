import { html, css, LitElement } from 'lit-element'
import toStream from 'string-to-stream'
import intoStream from 'into-stream'
import { serializers, parsers } from '@rdf-esm/formats-common'
import '@vanillawc/wc-codemirror'
import './mode/javascript.js'
import './mode/turtle.js'
import './mode/ntriples.js'

function whenDefined(getter) {
  const interval = 10
  const maxWaits = 100
  let counter = 0

  return new Promise((resolve, reject) => {
    const awaiter = setInterval(() => {
      const value = getter()
      if (value) {
        clearInterval(awaiter)
        resolve()
      }
      counter += 1
      if (counter === maxWaits) {
        clearInterval(awaiter)
        reject(new Error('Value did not become truthy in time'))
      }
    }, interval)
  })
}

const Serialized = Symbol('serialized quads')
const Format = Symbol('rdf serialization')

/**
 * An text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.
 */
export class RdfjsEditor extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        text-align: left;
      }

      wc-codemirror {
        width: 100%;
        height: 100%;
      }
    `
  }

  static get properties() {
    return {
      readonly: { type: Boolean, reflect: true },
      format: { type: String, reflect: true },
    }
  }

  constructor() {
    super()
    this.ready = whenDefined(() => this.codeMirror?.__initialized)
  }

  /**
   * The underlying `<wc-codemirror>` element
   */
  get codeMirror() {
    return this.renderRoot.querySelector('wc-codemirror')
  }

  /**
   * The string representation of the RDF graph.
   *
   * The syntax is not validated until quads getter is invoked.
   *
   * @return {string}
   */
  get serialized() {
    return this[Serialized]
  }

  set serialized(value) {
    const oldValue = this.serialized
    this[Serialized] = value

    this.__updateValue().then(() =>
      this.requestUpdate('serialized', oldValue)
    )
  }

  /**
   * Media type of the RDF serialization to use.
   *
   * Custom parsers and serializers must be added to @rdf-esm/formats-common
   *
   * @return {string}
   */
  get format() {
    return this[Format]
  }

  set format(value) {
    const oldValue = this[Format]
    this[Format] = value
    this.__updateFormat().then(() =>
      this.requestUpdate('format', oldValue)
    )
  }

  /**
   * Array of RDF/JS quads
   *
   * The getter is async!
   */
  get quads() {
    return this.__parse()
  }

  set quads(value) {
    const stream = serializers.import(
      this.format,
      intoStream.object(value || '')
    )

    ;(async () => {
      let serialized = ''
      for await(const chunk of stream) {
        serialized += chunk
      }

      this.serialized = serialized
    })()
  }

  async firstUpdated(props) {
    super.firstUpdated(props)
    await this.ready
    this.__updateValue()
    this.codeMirror.editor.setSize('100%', '100%')
  }

  render() {
    return html` <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/codemirror.min.css');
      </style>
      <wc-codemirror mode="${this.format}" ?readonly="${this.readonly}">
      </wc-codemirror>`
  }

  async __updateFormat() {
    await this.ready
    this.codeMirror.editor.setOption('mode', this[Format])
  }

  async __updateValue() {
    await this.ready
    this.codeMirror.editor.setValue(this[Serialized] || '')
  }

  async __parse() {
    const inputStream = toStream(this.codeMirror.editor.getValue())
    const quads = []

    const quadStream = parsers.import(this.format, inputStream)
    if (!quadStream) {
      throw new Error(`No parser found for ${this.format}`)
    }

    for await (const quad of quadStream) {
      quads.push(quad)
    }

    return quads
  }
}
