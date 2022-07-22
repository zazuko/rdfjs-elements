import { dispatcher } from './lib/dispatcher.js'

let currentLanguages = navigator.languages

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
