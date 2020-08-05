import { html, css, LitElement, property, query } from 'lit-element';
import toStream from 'string-to-stream';
import intoStream from 'into-stream';
import { serializers, parsers } from '@rdf-esm/formats-common';
import '@vanillawc/wc-codemirror';
import './mode/javascript.js';
import './mode/turtle.js';
import './mode/ntriples.js';

function whenDefined(getter) {
  const interval = 10;
  const maxWaits = 100;
  let counter = 0;

  return new Promise((resolve, reject) => {
    const awaiter = setInterval(() => {
      const value = getter();
      if (value) {
        clearInterval(awaiter);
        resolve();
      }
      counter += 1;
      if (counter === maxWaits) {
        clearInterval(awaiter);
        reject(new Error('Value did not become truthy in time'));
      }
    }, interval);
  });
}

const Serialized = Symbol('serialized quads');
const Format = Symbol('rdf serialization');

export class RdfjsEditor extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        text-align: left;
      }

      wc-codemirror {
        width: 100%;
        height: 100%;
      }
    `;
  }

  @property({ type: Boolean, attribute: 'readonly', reflect: true })
  readonly = false;

  __language = '';

  @query('wc-codemirror')
  codeMirror = null;

  get serialized() {
    return this[Serialized];
  }

  set serialized(value) {
    this[Serialized] = value;
    this.updateValue();
  }

  @property({ type: String })
  get format() {
    return this[Format];
  }

  set format(value) {
    this[Format] = value;
    this.updateFormat();
  }

  set quads(value) {
    const stream = serializers.import(
      this.format,
      intoStream.object(value || '')
    );

    let serialized = '';
    stream.on('data', chunk => {
      serialized += chunk;
    });
    stream.on('end', () => {
      this.serialized = serialized;
    });
    stream.on('error', console.error);
  }

  async firstUpdated(props) {
    super.firstUpdated(props);
    await whenDefined(() => this.codeMirror?.__initialized);
    this.updateValue();
    this.codeMirror.editor.setSize('100%', '100%');
  }

  render() {
    return html` <style>
        @import url(https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/codemirror.min.css);
      </style>
      <wc-codemirror mode="${this.format}" ?readonly="${this.readonly}">
      </wc-codemirror>`;
  }

  updateFormat() {
    if (this.codeMirror?.__initialized) {
      this.codeMirror.editor.setOption('mode', this.__language);
    }
  }

  updateValue() {
    if (this.codeMirror?.__initialized) {
      this.codeMirror.editor.setValue(this[Serialized] || '');
    }
  }

  async parse() {
    const inputStream = toStream(this.codeMirror.editor.getValue());
    const quads = [];
    for await (const quad of parsers.import(this.format, inputStream)) {
      quads.push(quad);
    }

    return quads;
  }
}
