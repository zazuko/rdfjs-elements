import { directive, Directive } from 'lit/directive.js'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { taggedLiteral } from './taggedLiteral.js'

/**
 * @typedef {import('clownface').AnyPointer | import('@tpluscode/rdfine').RdfResource | undefined} PointerLike
 */

class LocalizedLabelDirective extends Directive {
  /**
   *
   * @param {PointerLike} resource
   * @param {object} [options]
   * @param {import('@rdfjs/types').NamedNode | Array<import('@rdfjs/types').NamedNode>} [options.property]
   * @param {*} [options.fallback]
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
    /**
     * @private
     * @type {PointerLike | undefined}
     */
    this.pointer =
      resource && 'pointer' in resource ? resource.pointer : resource

    const label = this.pointer?.out(this.property)
    return taggedLiteral(label, { fallback })
  }
}

export const localizedLabel = directive(LocalizedLabelDirective)
