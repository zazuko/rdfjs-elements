import { html, css, LitElement } from 'lit-element'
import '@vanillawc/wc-codemirror'
import { debounce } from 'throttle-debounce'

const Value = Symbol('Initial value')
const Dirty = Symbol('Editor dirty')
const ParseHandler = Symbol('ParseHandler')
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
 * @prop {boolean} autoParse - if set to true, parses the contents automatically when typing. Otherwise, parses on `blur` event
 *
 * @prop {Number} parseDelay - time in milliseconds after which parsing will begin while typing. Only applies when `autoParse` is set
 *
 * @csspart error - Line or part of line highlighted as result of parsing error. By default style is red wavy underline
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

      [part='error'] {
        text-decoration: underline;
        text-decoration-color: red;
        text-decoration-style: wavy;
      }

      wc-codemirror {
        width: 100%;
        height: 100%;
      }
    `
  }

  static get properties() {
    return {
      value: { type: String, noAccessor: true },
      readonly: { type: Boolean, reflect: true },
      prefixes: { type: String, attribute: 'prefixes' },
      isParsing: { type: Boolean, attribute: 'is-parsing', reflect: true },
      autoParse: { type: Boolean, attribute: 'auto-parse' },
      parseDelay: { type: Number },
    }
  }

  constructor() {
    super()
    this.parseDelay = 250
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

  /**
   * Gets the text contents of the underlying editor
   * @returns {string}
   */
  get value() {
    return this.codeMirror.editor.getValue()
  }

  set value(value) {
    if (this.codeMirror && this.codeMirror.editor) {
      if (this.value !== value) {
        this.codeMirror.editor.setValue(value)
        this[ParseHandler]()
      }
    } else {
      this[Value] = value
    }
  }

  async firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties)

    if (this[Value]) {
      await this.ready
      this.codeMirror.editor.setValue(this[Value])
      this[ParseHandler]()
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties)
    if (
      _changedProperties.has('autoParse') ||
      _changedProperties.has('parseDelay')
    ) {
      this.__setParseHandler()
    }
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

    if (this.__errorMarker) {
      this.__errorMarker.clear()
    }

    this.isParsing = true
    try {
      await this._parse()
    } catch (error) {
      if (typeof this._errorLine === 'function') {
        this.__highlightError(this._errorLine(error))
      }

      this.dispatchEvent(
        new CustomEvent('parsing-failed', {
          detail: { error },
        })
      )
    } finally {
      this.isParsing = false
    }
  }

  async _initializeCodeMirror() {
    this.codeMirror.editor.setSize('100%', '100%')
    this.__setParseHandler()
    this.codeMirror.editor.on('change', () => {
      this[Dirty] = true
    })
  }

  __setParseHandler() {
    if (!this.codeMirror.editor) {
      return
    }

    if (this[ParseHandler]) {
      this.codeMirror.editor.off('blur', this[ParseHandler])
      this.codeMirror.editor.off('change', this[ParseHandler])
    }

    if (this.autoParse) {
      this[ParseHandler] = debounce(
        this.parseDelay,
        this.__beginParse.bind(this)
      )
      this.codeMirror.editor.on('change', this[ParseHandler])
    } else {
      this[ParseHandler] = this.__beginParse.bind(this)
      this.codeMirror.editor.on('blur', this[ParseHandler])
    }
  }

  async __beginParse() {
    if (this[Dirty]) {
      await this.parse()
    }

    this[Dirty] = false
  }

  __highlightError(range) {
    let from = { line: 0, ch: 0 }
    let to = { line: 0, ch: Number.MAX_SAFE_INTEGER }

    if (range && range.from) {
      from = range.from
    }
    if (range && range.to) {
      to = range.to
    }
    const title = range ? range.message : ''

    this.__errorMarker = this.codeMirror.editor.getDoc().markText(from, to, {
      attributes: { part: 'error', title },
    })
    this.codeMirror.editor.scrollIntoView(from)
  }
}
