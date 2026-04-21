import { xsd } from '@tpluscode/rdf-ns-builders'
import { shrink } from '@zazuko/prefixes'

export class LongLiteral {
  constructor(term) {
    this.term = term
  }

  toTerm() {
    const raw = `"""${LongLiteral.escapeValue(this.term.value)}"""`

    return {
      terse: prefixes => raw + this.langOrDatatype(prefixes),
      verbose: prefixes => raw + this.langOrDatatype(prefixes),
    }
  }

  static escapeValue(value) {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/"""/g, '""\\"')
      .replace(/"{1,2}$/, match => `${match.slice(0, -1)}\\"`)
  }

  langOrDatatype(prefixes) {
    if (this.term.language) {
      return `@${this.term.language}`
    }

    if (this.term.datatype.equals(xsd.string)) {
      return ''
    }

    const shrunk = shrink(this.term.datatype.value, prefixes)
    if (!shrunk) {
      return `^^<${this.term.datatype.value}>`
    }

    return `^^${shrunk}`
  }
}

export const coercions = new Map([[LongLiteral, literal => literal.toTerm()]])
