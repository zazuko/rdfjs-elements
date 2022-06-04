import { directive, AsyncDirective } from 'lit/async-directive.js'
import { rdfs } from '@tpluscode/rdf-ns-builders'

let defaultLanguages = [...navigator.languages]
const dispatcher = document.createElement('p')

/**
 * @typedef {import('clownface').AnyPointer | import('@tpluscode/rdfine').RdfResource | undefined} PointerLike
 */

class TaggedLiteralDirective extends AsyncDirective {
  /**
   *
   * @param {import('lit/directive').PartInfo} part
   */
  constructor(part) {
    super(part)

    /**
     * @private
     */
    this.languages = defaultLanguages

    /**
     * @private
     * @readonly
     */
    this.languageUpdated = e => {
      this.languages = e.detail
      this.setValue(this.getTranslation())
    }

    dispatcher.addEventListener('language-set', this.languageUpdated)
  }

  /**
   *
   * @param {PointerLike} resource
   * @param {object} [options]
   * @param {import('@rdfjs/types').NamedNode} [options.property]
   * @param {string} [options.fallback]
   * @returns {string|*}
   */
  render(resource, { property = rdfs.label, fallback = '' } = {}) {
    /**
     * @private
     * @type {import('@rdfjs/types').NamedNode}
     */
    this.property = property
    /**
     * @private
     * @type {string}
     */
    this.fallback = fallback
    if (resource) {
      /**
       * @private
       * @type {PointerLike}
       */
      this.pointer = 'pointer' in resource ? resource.pointer : resource
    }

    return this.getTranslation()
  }

  disconnected() {
    dispatcher.removeEventListener('language-set', this.languageUpdated)
  }

  /**
   * @private
   */
  getTranslation() {
    if (!this.property || !this.pointer) {
      return this.fallback
    }

    return (
      this.pointer
        .out(this.property, { language: [...this.languages, '*'] })
        .values.shift() || this.fallback
    )
  }
}

export const taggedLiteral = directive(TaggedLiteralDirective)

/**
 *
 * @param {string[]} preferredLanguages
 */
export function setLanguages(...preferredLanguages) {
  defaultLanguages = preferredLanguages
  dispatcher.dispatchEvent(
    new CustomEvent('language-set', {
      detail: preferredLanguages,
    })
  )
}
