import * as builders from '@tpluscode/rdf-ns-builders'
import Editor, { defaultPrefixes } from '@rdfjs-elements/editor-base'
import './mode/javascript.js'
import './mode/turtle.js'
import './mode/ntriples.js'
import './mode/xml.js'

const Quads = Symbol('parsed quads')

/**
 * A text editor custom element which parses and serializes RDF/JS Quads using a selected RDF format.
 *
 * ## Usage
 *
 * The element requires a single property/attribute `format` which should be an RDF serialization media type supported by
 * `@rdf-esm/formats-common` package.
 *
 * The element is easiest to bootstrap by setting the `value` property **before** first render. This property is
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
 * const template = html`<rdf-editor format="application/ld+json" .value="${initialValue}"></rdf-editor>`
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
 * @prop {string} value - The string representation of the RDF graph.
 *
 * @prop {string} format - Media type of the RDF serialization to use.
 *
 * Custom parsers and serializers must be added to `@rdf-esm/formats-common`
 *
 * @prop {boolean} noReserialize - Prevents the editor from serializing the quads when format changes
 *
 * @prop {Quad[]} quads - get or sets the RDF/JS quads
 *
 * @fires {CustomEvent<{ quads: Quad[]; }>} quads-changed - when the editor contents have changed and have been successfully parsed
 * @fires {CustomEvent<{ notFound?: boolean; error?: Error; }>} parsing-failed - when the editor contents have changed and but failed to parse. Check `detail.noParser` (boolean) or `detail.error` properties for the reason
 * @fires {CustomEvent<{ prefixes: Record<string, string>; }>} prefixes-parsed - prefixes returned by parser
 *
 */
export class RdfEditor extends Editor {
  static get properties() {
    return {
      format: { type: String, reflect: true },
      quads: { type: Array },
      noReserialize: { type: Boolean, attribute: 'no-reserialize' },
    }
  }

  constructor() {
    super()
    this.isParsing = false
    this.noReserialize = false
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.ready = null
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

  async updated(_changedProperties) {
    super.updated(_changedProperties)

    let shouldSerialize = false
    const hasQuads = this.quads && this.quads.length > 0
    if (_changedProperties.get('format')) {
      shouldSerialize = hasQuads && !this.noReserialize
    }
    if (_changedProperties.has('quads')) {
      shouldSerialize = true
    }
    if (
      _changedProperties.has('prefixes') ||
      _changedProperties.has('customPrefixes')
    ) {
      shouldSerialize = hasQuads
    }

    if (shouldSerialize) {
      this.__serialize()
    }
  }

  async _parse() {
    const { parsers } = await import('@rdfjs-elements/formats-pretty')
    const { toStream } = await import('./stream')

    const inputStream = toStream(this.value)
    const quads = []
    const prefixes = {}

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

    quadStream.on('prefix', (prefix, ns) => {
      prefixes[prefix] = ns
    })
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
    this.__notifyParsedPrefixes(prefixes)
  }

  async __serialize() {
    if (!this.format) return

    await this.ready

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
      prefixes: await this._combinePrefixes(),
    })

    if (!quadStream) {
      this.value = `No serializer found for media type ${this.format}`
      return
    }

    let serialized = ''
    for await (const chunk of quadStream) {
      serialized += chunk
    }

    if (this.format === formats.formats.jsonLd) {
      serialized = JSON.stringify(JSON.parse(serialized), null, 2)
    }

    this.value = serialized
    this.dispatchEvent(
      new CustomEvent('serialized', {
        detail: {
          value: serialized,
        },
      })
    )
  }

  // eslint-disable-next-line class-methods-use-this
  _errorLine(error) {
    const errorDetails = { message: error.message }

    if (error.context && error.context.line) {
      errorDetails.from = { line: error.context.line - 1, ch: 0 }
      errorDetails.to = {
        line: error.context.line - 1,
        ch: Number.MAX_SAFE_INTEGER,
      }
    }

    return errorDetails
  }

  __notifyParsedPrefixes(parsedPrefixes) {
    const prefixes = {}
    const customPrefixes = { ...parsedPrefixes }

    for (const [prefix, ns] of Object.entries(parsedPrefixes)) {
      if (defaultPrefixes.includes(prefix)) {
        delete customPrefixes[prefix]
      } else if (prefix in builders) {
        prefixes[prefix] = ns
        delete customPrefixes[prefix]
      }
    }

    this.dispatchEvent(
      new CustomEvent('prefixes-parsed', {
        detail: {
          prefixes: {
            ...prefixes,
            ...customPrefixes,
          },
        },
      })
    )
  }
}
