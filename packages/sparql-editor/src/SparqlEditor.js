import Editor from '@rdfjs-elements/editor-base'
import Sparql from 'sparqljs'
import './mode/sparql.js'

const Parsed = Symbol('sparql-object')
const generator = new Sparql.Generator()

/**
 * A text editor custom element which highlights and parses SPARQL queries.
 *
 * It uses [sparqljs](https://npm.im/sparqljs) to parse the query text.
 *
 * ## Usage
 *
 * Simply add the element to a page. It is possible to provide common prefixes and a base IRI
 * so that they don't have to be explicitly added in the SPARQL string
 *
 * ```js
 * import '@rdfjs-elements/sparql-editor'
 * import { html } from 'lit-html'
 *
 * const value = `CONSTRUCT { ?s ?p ?o }
 * FROM <john-doe>
 * WHERE {
 *   <john-doe> a schema:Person ;
 *   schema:name "John Doe" .
 * }`
 *
 * const template = html`<rdf-editor prefixes="schema" baseIRI="http://example.com/" .value="${value}"></rdf-editor>`
 * ```
 *
 * @prop {string} value - The raw contents of the code editor
 *
 * @prop {string} baseIRI - Value of the `BASE` directive which will be injected to the query
 *
 * @readonly @prop {object} query - The JS object representing the query
 *
 * @fires {CustomEvent<{ value: string; query: object }>} parsed - when the editor contents have changed and have been successfully parsed
 * @fires {CustomEvent} parsing-failed - when there as in an error in parsing the query
 */
export class SparqlEditor extends Editor {
  static get properties() {
    return {
      value: { type: String },
      baseIRI: { type: String, attribute: 'base-iri' },
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get format() {
    return 'application/sparql-query'
  }

  get query() {
    return this[Parsed]
  }

  async updated(_changedProperties) {
    await super.updated(_changedProperties)

    let shouldParse = false

    if (_changedProperties.has('value')) {
      shouldParse = true
      await this._updateValue(this.value)
    }

    if (_changedProperties.has('prefixes')) {
      shouldParse = true
    }

    if (shouldParse) {
      this.parse()
    }
  }

  async _parse() {
    try {
      const parser = new Sparql.Parser({
        baseIRI: this.baseIRI,
        prefixes: await this._prefixes(),
      })

      const query = parser.parse(this.value)
      this[Parsed] = query

      this.dispatchEvent(
        new CustomEvent('parsed', {
          detail: {
            value: generator.stringify(query),
            query,
          },
        })
      )
    } catch (error) {
      this[Parsed] = undefined
      throw error
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _errorLine(error) {
    const { hash, message } = error

    if (hash) {
      const { loc } = hash
      return {
        from: { line: loc.first_line - 1, ch: loc.first_column },
        to: { line: loc.last_line - 1, ch: loc.last_column },
        message,
      }
    }

    return { message }
  }
}
