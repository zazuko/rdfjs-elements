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

const Quads = Symbol('parsed quads')

/**
 * An text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.
 *
 * @prop {string} serialized - The string representation of the RDF graph.
 *
 * Note that this property is only used to set the initial value of the editor. For updates `quads` should be used
 *
 * @prop {string} format - Media type of the RDF serialization to use.
 *
 * Custom parsers and serializers must be added to `@rdf-esm/formats-common`
 *
 * @fires quads-changed - when the editor contents have changed and have been successfully parsed
 * @fires parsing-failed - when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason
 */
export class RdfEditor extends LitElement {
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
      serialized: { type: String },
      quads: { type: Array },
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
   * Gets or set RDF/JS quads. Setting will parse them using the chosen `format` and set to the text editor
   *
   * @returns {Quad[]}
   */
  get quads() {
    return this[Quads]
  }

  set quads(value) {
    this[Quads] = value
  }

  async updated(_changedProperties) {
    super.updated(_changedProperties)

    let shouldSerialize = false
    if (_changedProperties.get('format')) {
      await this.__updateFormat()
      shouldSerialize = true
    }
    if (_changedProperties.get('quads')) {
      shouldSerialize = true
    }

    if (shouldSerialize) {
      this.__serialize()
    }
  }

  async firstUpdated(props) {
    super.firstUpdated(props)
    await this.ready
    this.codeMirror.editor.setSize('100%', '100%')
    this.codeMirror.editor.on('blur', () => this.__parse())

    if (this.serialized) {
      const firstParse = () => {
        this.__parse()
        this.codeMirror.editor.off('change', firstParse)
      }
      this.codeMirror.editor.on('change', firstParse)
      this.__updateValue(this.serialized)
    } else if (this.quads) {
      this.__serialize()
    }
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
    this.codeMirror.editor.setOption('mode', this.format)
  }

  async __updateValue(value) {
    await this.ready
    this.codeMirror.editor.setValue(value || '')
  }

  async __parse() {
    await this.updateComplete

    const inputStream = toStream(this.codeMirror.editor.getValue())
    const quads = []

    const quadStream = parsers.import(this.format, inputStream)
    if (!quadStream) {
      this.dispatchEvent(
        new CustomEvent('parsing-failed', {
          detail: {
            notFound: true,
          },
        })
      )
      return
    }

    for await (const quad of quadStream) {
      quads.push(quad)
    }

    this[Quads] = quads
    this.dispatchEvent(
      new CustomEvent('quads-changed', {
        detail: {
          value: quads,
        },
      })
    )
  }

  async __serialize() {
    if (!this.format) return

    const stream = serializers.import(
      this.format,
      intoStream.object(this.quads || [])
    )

    if (!stream) {
      this.serialized = `No parser found for media type ${this.format}`
      return
    }

    let serialized = ''
    for await (const chunk of stream) {
      serialized += chunk
    }

    this.__updateValue(serialized)
  }
}
