import { html, css, LitElement } from 'lit-element'
import '@vanillawc/wc-codemirror'
import './mode/javascript.js'
import './mode/turtle.js'
import './mode/ntriples.js'
import './mode/xml.js'

const defaultPrefixes = ['rdf', 'rdfs', 'xsd']
const Dirty = Symbol('Editor dirty')

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
 * A text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.
 *
 * ## Usage
 *
 * The element requires a single property/attribute `format` which should be an RDF serialization media type supported by
 * `@rdf-esm/formats-common` package.
 *
 * The element is easiest to bootstrap by setting the `serialized` property **before** first render. This property is
 * only used to provide the initial contents of the editor as it is parsed on first render, when the element has been added
 * to the page.
 *
 * ```js
 * import '@rdfjs-elements/rdf-editor'
 * import { html } from 'lit-html'
 *
 * const jsonld = {
 *   '@context': {
 *     '@base': 'http://example.com/',
 *     '@vocab': 'http://schema.org/'
 *   },
 *   '@id': 'john-doe',
 *   '@type': 'Person',
 *   '@name': 'John Doe'
 * }
 *
 * const initialValue = JSON.stringify(jsonld, null, 2)
 *
 * const template = html`<rdf-editor format="application/ld+json" .serialized="${initialValue}"></rdf-editor>`
 * ```
 *
 * By default most common formats are supported
 *
 * - JSON-LD
 * - N-Triples
 * - N-Quads
 * - RDF/XML
 * - Turtle/N3
 * - TriG *(no highlighting)*
 *
 * Syntax highlighting is relying on support from CodeMirror.
 *
 * @prop {string} serialized - The string representation of the RDF graph.
 *
 * Note that this property is only used to set the initial value of the editor. For updates `quads` should be used
 *
 * @prop {string} format - Media type of the RDF serialization to use.
 *
 * Custom parsers and serializers must be added to `@rdf-esm/formats-common`
 *
 * @prop {Promise<void>} ready - a one-time promise which resolves when CodeMirror has been initialized
 *
 * @prop {Quad[]} quads - get or sets the RDF/JS quads
 *
 * @prop {string} prefixes - a comma-separated list of prefixes to use for serializing. Always includes `rdf`, `rdfs` and `xsd` Any prefix included in the [`@zazuko/rdf-vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used
 *
 * @prop {boolean} isParsing - set to true while the elements parses data when the code hass changed
 *
 * @fires {CustomEvent<{ quads: Quad[]; }>} quads-changed - when the editor contents have changed and have been successfully parsed
 * @fires {CustomEvent<{ notFound?: boolean; error?: Error; }>} parsing-failed - when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason
 *
 * @csspart CodeMirror - The main CodeMirror wrapper element. This and other parts are directly generated from CSS classes set by CodeMirror and should be fairly self-explanatory but not equally useful 😉
 * @csspart CodeMirror-vscrollbar
 * @csspart CodeMirror-hscrollbar
 * @csspart CodeMirror-scrollbar-filler
 * @csspart CodeMirror-gutter-filler
 * @csspart CodeMirror-scroll
 * @csspart CodeMirror-sizer
 * @csspart CodeMirror-lines
 * @csspart CodeMirror-measure
 * @csspart CodeMirror-measure
 * @csspart CodeMirror-cursors
 * @csspart CodeMirror-code
 * @csspart CodeMirror-gutters
 * @csspart CodeMirror-linenumbers
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
      prefixes: { type: String, attribute: 'prefixes' },
      serialized: { type: String },
      quads: { type: Array },
      isParsing: { type: Boolean, attribute: 'is-parsing', reflect: true },
    }
  }

  constructor() {
    super()
    this.isParsing = false
  }

  connectedCallback() {
    super.connectedCallback()
    this.ready = whenDefined(
      () => this.codeMirror && this.codeMirror.__initialized
    ).then(async () => {
      await this.__initializeCodeMirror()
      ;[...this.renderRoot.querySelectorAll('[class^=CodeMirror]')].forEach(
        el => {
          el.classList.forEach(clas => {
            if (clas.match(/^CodeMirror/)) {
              el.setAttribute('part', clas)
            }
          })
        }
      )
      this.codeMirror.editor.refresh()
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.ready = null
    if (this.codeMirror.editor) {
      this.codeMirror.editor.toTextArea()
    }
    this.codeMirror.__initialized = false
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
    if (typeof value === 'undefined' || value === null) {
      return
    }

    const oldValue = this[Quads]
    this[Quads] = value
    this.requestUpdate('quads', oldValue)
  }

  get _prefixes() {
    return async () => {
      const ns = await import('@tpluscode/rdf-ns-builders')

      const prefixes = (this.prefixes || '')
        .split(',')
        .map(prefix => prefix.trim())

      return [...defaultPrefixes, ...prefixes].reduce((map, prefix) => {
        if (prefix in ns) {
          return { ...map, [prefix]: ns[prefix]().value }
        }

        return map
      }, {})
    }
  }

  async updated(_changedProperties) {
    super.updated(_changedProperties)

    let shouldSerialize = false
    const hasQuads = this.quads && this.quads.length > 0
    if (_changedProperties.get('format')) {
      await this.__updateFormat()
      shouldSerialize = hasQuads
    }
    if (_changedProperties.has('quads')) {
      shouldSerialize = true
    }
    if (_changedProperties.has('readonly')) {
      this.codeMirror.editor.setOption('readOnly', this.readonly)
    }
    if (_changedProperties.has('prefixes')) {
      shouldSerialize = hasQuads
    }

    if (shouldSerialize) {
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
    this.isParsing = true
    await this.updateComplete

    const { parsers } = await import('@rdfjs-elements/formats-pretty')
    const { toStream } = await import('./stream')

    const inputStream = toStream(this.codeMirror.editor.getValue())
    const quads = []

    try {
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
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('parsing-failed', {
          detail: { error },
        })
      )
    } finally {
      this.isParsing = false
    }
  }

  async __serialize() {
    if (!this.format) return

    const formats = await import('@rdfjs-elements/formats-pretty')
    const { Readable } = await import('./stream')

    const quads = [...(this.quads || [])]
    const stream = new Readable({
      objectMode: true,
      read() {
        if (quads.length === 0) {
          this.push(null)
          return
        }

        this.push(quads.shift())
      },
    })

    const quadStream = formats.serializers.import(this.format, stream, {
      prefixes: await this._prefixes(),
    })

    if (!quadStream) {
      this.serialized = `No serializer found for media type ${this.format}`
      return
    }

    let serialized = ''
    for await (const chunk of quadStream) {
      serialized += chunk
    }

    if (this.format === formats.formats.jsonLd) {
      serialized = JSON.stringify(JSON.parse(serialized), null, 2)
    }

    this.__updateValue(serialized)
    this.serialized = serialized
    this.dispatchEvent(
      new CustomEvent('serialized', {
        detail: {
          value: serialized,
        },
      })
    )
  }

  async __initializeCodeMirror() {
    this.codeMirror.editor.setSize('100%', '100%')
    this.codeMirror.editor.on('blur', async () => {
      if (this[Dirty]) {
        await this.__parse()
      }

      this[Dirty] = false
    })
    this.codeMirror.editor.on('change', () => {
      this[Dirty] = true
    })

    if (this.serialized) {
      const firstParse = () => {
        this.__parse()
        this.codeMirror.editor.off('change', firstParse)
      }
      this.codeMirror.editor.on('change', firstParse)
      this.__updateValue(this.serialized)
    } else if (this.quads) {
      await this.__serialize()
    }
  }
}
