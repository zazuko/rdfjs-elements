import { LitElement, html, css } from 'lit-element';
import '@rdfjs-elements/rdf-editor/rdf-editor.js';

export class RdfjsElementsDemos extends LitElement {
  static get properties() {
    return {
      input: { type: String },
      output: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button {
        width: 50px;
        height: 50px;
      }

      .editor {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;
        height: 100vh;
      }

      rdf-editor {
        height: 100%;
        padding: 20px;
      }
    `;
  }

  constructor() {
    super();
    this.input = `{
  "@context": {
    "@vocab": "http://schema.org/"
  },
  "name": "John Doe"
}`;
  }

  render() {
    return html`
      <div class="editor">
        <h1>Input</h1>
        <rdf-editor
          id="input"
          format="application/ld+json"
          .serialized="${this.input}"
        ></rdf-editor>
      </div>
      <button @click="${this._translate}">&gt;</button>
      <div class="editor">
        <h1>Output</h1>
        <rdf-editor
          format="text/turtle"
          readonly
          .quads="${this.output}"
        ></rdf-editor>
      </div>
    `;
  }

  async _translate() {
    this.output = await this.renderRoot.querySelector('#input').quads;
  }
}
