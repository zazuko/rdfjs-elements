import { css, html, LitElement } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'

import '@rdfjs-elements/rdf-editor'

const formatLabels = {
  'text/turtle': 'Turtle',
  'application/ld+json': 'JSON-LD',
}

export class RdfSnippet extends LitElement {
  static get properties() {
    return {
      inputFormat: { type: String, attribute: 'input-format' },
      outputFormats: { type: Array, attribute: 'output-formats' },
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }
    `
  }

  render() {
    return html`<ol>
        ${this._renderButtons()}
      </ol>
      <rdf-editor></rdf-editor>`
  }

  _renderButtons() {
    return html`${repeat(
      this.outputFormats,
      format => html`<li>${formatLabels[format] || format}</li>`
    )}`
  }
}
