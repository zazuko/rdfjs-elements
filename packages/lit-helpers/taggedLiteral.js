import { AsyncDirective, directive } from 'lit/async-directive.js'
import only from 'clownface/filter.js'
import { dispatcher } from './lib/dispatcher.js'
import { displayLanguages } from './index.js'

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
    this.languages = displayLanguages()

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
   * @param {import('clownface').AnyPointer | undefined} pointer
   * @param {object} [options]
   * @param {string} [options.fallback]
   * @returns {string|*}
   */
  render(pointer, { fallback = '' } = {}) {
    this.pointer = pointer
    this.fallback = fallback

    return this.getTranslation()
  }

  disconnected() {
    dispatcher.removeEventListener('language-set', this.languageUpdated)
  }

  /**
   * @private
   */
  getTranslation() {
    if (!this.pointer) {
      return this.fallback
    }

    return (
      this.pointer
        .filter(only.taggedLiteral([...this.languages, '*']))
        .values.shift() || this.fallback
    )
  }
}

export const taggedLiteral = directive(TaggedLiteralDirective)
