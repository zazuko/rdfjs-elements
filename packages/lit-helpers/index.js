import only from 'clownface/filter.js'
import { dispatcher } from './lib/dispatcher.js'

const { navigator } = typeof global !== 'undefined' ? global : window

let currentLanguages = navigator?.languages || []

/**
 *
 * @returns {ReadonlyArray<string>}
 */
export function displayLanguages() {
  return currentLanguages
}

/**
 *
 * @param {string[]} preferredLanguages
 */
export function setLanguages(...preferredLanguages) {
  currentLanguages = Object.freeze(preferredLanguages)
  dispatcher.dispatchEvent(
    new CustomEvent('language-set', {
      detail: preferredLanguages,
    })
  )
}

/**
 *
 * @param {import('clownface').MultiPointer} pointer
 * @return {string}
 */
export function getLocalizedLabel(pointer) {
  return pointer
    .filter(only.taggedLiteral([...currentLanguages, '*']))
    .values.shift()
}
