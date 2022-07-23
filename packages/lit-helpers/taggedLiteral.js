import { AsyncDirective, directive } from 'lit/async-directive.js'
import { dispatcher } from './lib/dispatcher.js'
import { getLocalizedLabel } from './index.js'

/**
 * @typedef {import('clownface').AnyPointer | undefined} Pointer
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
     * @readonly
     */
    this.languageUpdated = () => {
      this.setValue(this.getTranslation())
    }

    dispatcher.addEventListener('language-set', this.languageUpdated)
  }

  /**
   *
   * @param {Pointer} pointer
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

    return getLocalizedLabel(this.pointer) || this.fallback
  }
}

export const taggedLiteral = directive(TaggedLiteralDirective)
