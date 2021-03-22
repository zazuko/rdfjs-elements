import { html, css, LitElement } from 'lit-element'
import '@vanillawc/wc-codemirror'

const Dirty = Symbol('Editor dirty')
const defaultPrefixes = ['rdf', 'rdfs', 'xsd']

function whenDefined(getter) {
  const interval = 10
  const maxWaits = 100
  let counter = 0

  return new Promise((resolve, reject) => {
    const awaiter = setInterval(() => {
      const value = getter()
      if (value) {
        clearInterval(awaiter)
        resolve()
      }
      counter += 1
      if (counter === maxWaits) {
        clearInterval(awaiter)
        reject(new Error('Value did not become truthy in time'))
      }
    }, interval)
  })
}

/**
 * A base ("abstract") class, used to implement other text editor `@rdfjs-elements/*`.
 *
 * @prop {Promise<void>} ready - a one-time promise which resolves when CodeMirror has been initialized
 *
 * @prop {string} prefixes - a comma-separated list of prefixes to use for serializing. Always includes `rdf`, `rdfs` and `xsd` Any prefix included in the [`@zazuko/rdf-vocabularies` package](https://github.com/zazuko/rdf-vocabularies/tree/master/ontologies) can be used
 *
 * @prop {boolean} isParsing - set to true while the elements parses data when the code has changed
 *
 * @csspart CodeMirror - The main CodeMirror wrapper element. This and other parts are directly generated from CSS classes set by CodeMirror and should be fairly self-explanatory but not equally useful 😉
 * @csspart CodeMirror-vscrollbar
 * @csspart CodeMirror-hscrollbar
 * @csspart CodeMirror-scrollbar-filler
 * @csspart CodeMirror-gutter-filler
 * @csspart CodeMirror-scroll
 * @csspart CodeMirror-sizer
 * @csspart CodeMirror-lines
 * @csspart CodeMirror-measure
 * @csspart CodeMirror-measure
 * @csspart CodeMirror-cursors
 * @csspart CodeMirror-code
 * @csspart CodeMirror-gutters
 * @csspart CodeMirror-linenumbers
 */
export default class Editor extends LitElement {
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
    `
  }

  static get properties() {
    return {
      readonly: { type: Boolean, reflect: true },
      prefixes: { type: String, attribute: 'prefixes' },
      isParsing: { type: Boolean, attribute: 'is-parsing', reflect: true },
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ready = whenDefined(
      () => this.codeMirror && this.codeMirror.__initialized
    ).then(async () => {
      await this._initializeCodeMirror()
      ;[...this.renderRoot.querySelectorAll('[class^=CodeMirror]')].forEach(
        el => {
          el.classList.forEach(clas => {
            if (clas.match(/^CodeMirror/)) {
              el.setAttribute('part', clas)
            }
          })
        }
      )
      this.codeMirror.editor.refresh()
    })
  }

  get _prefixes() {
    return async () => {
      const ns = await import('@tpluscode/rdf-ns-builders')

      const prefixes = (this.prefixes || '')
        .split(',')
        .map(prefix => prefix.trim())

      return [...defaultPrefixes, ...prefixes].reduce((map, prefix) => {
        if (prefix in ns) {
          return { ...map, [prefix]: ns[prefix]().value }
        }

        return map
      }, {})
    }
  }

  /**
   * The underlying `<wc-codemirror>` element
   */
  get codeMirror() {
    return this.renderRoot.querySelector('wc-codemirror')
  }

  render() {
    return html` <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/codemirror.min.css');
      </style>
      <wc-codemirror mode="${this.format}" ?readonly="${this.readonly}">
      </wc-codemirror>`
  }

  async parse() {
    if (this.isParsing) {
      return
    }

    this.isParsing = true
    try {
      await this._parse()
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('parsing-failed', {
          detail: { error },
        })
      )
    } finally {
      this.isParsing = false
    }
  }

  async _updateValue(value) {
    await this.ready
    this.codeMirror.editor.setValue(value || '')
  }

  async _initializeCodeMirror() {
    this.codeMirror.editor.setSize('100%', '100%')
    this.codeMirror.editor.on('blur', async () => {
      if (this[Dirty]) {
        await this.parse()
      }

      this[Dirty] = false
    })
    this.codeMirror.editor.on('change', () => {
      this[Dirty] = true
    })
  }
}
