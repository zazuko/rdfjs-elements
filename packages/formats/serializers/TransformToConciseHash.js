import stream from 'readable-stream'
import { rdf, xsd } from '@tpluscode/rdf-ns-builders'
import TermMap from '@rdf-esm/term-map'
import graphy from '@graphy/core.data.factory'

function isListNode(predicates) {
  return predicates.has(rdf.first) && predicates.has(rdf.rest)
}

export class TransformToConciseHash extends stream.Transform {
  constructor({
    prefixes = {},
    strict = false,
    preserveListNodeProperties = false,
  } = {}) {
    super({ objectMode: true })

    this.prefixes = prefixes
    this.graphs = new TermMap()
    this.blankNodes = new TermMap()
    this.strict = strict
    this.preserveListNodeProperties = preserveListNodeProperties
  }

  _transform({ subject, predicate, object, graph }, _, cb) {
    const nodes = this.getGraph(graph)
    const node = nodes.get(subject) || { predicates: new TermMap() }

    const objects = node.predicates.get(predicate) || []
    node.predicates.set(predicate, [...objects, object])

    if (object.termType === 'BlankNode') {
      const usageCount = this.blankNodes.get(object) || 0
      this.blankNodes.set(object, usageCount + 1)
    }

    nodes.set(subject, node)
    cb()
  }

  _flush() {
    const value = [...this.graphs].reduce((graphs, [graph, nodes]) => {
      const graphKey = this.toHashKey(graph)
      let graphHash = graphs[graphKey] || {}

      graphHash = [...nodes].reduce(
        this.toConciseHash(graph).bind(this),
        graphHash
      )

      return {
        ...graphs,
        [graphKey]: graphHash,
      }
    }, {})

    this.push({
      type: this.strict ? 'c4r' : 'c4',
      value,
    })
    this.push(null)
  }

  toConciseHash(graph) {
    return (hash, [node, { predicates }]) => {
      if (!this.strict && this.blankNodes.get(node) === 1) {
        return hash
      }

      const nodeKey = this.toHashKey(node)

      return {
        ...hash,
        [nodeKey]: this.createPropertyMap(graph, predicates),
      }
    }
  }

  createPropertyMap(graph, predicates, level = 0) {
    const nestedObject = node => {
      if (!this.strict && this.blankNodes.get(node) === 1) {
        const entry = this.graphs.get(graph).get(node)

        if (entry) {
          return this.createPropertyMap(graph, entry.predicates, level + 1)
        }
      }

      return this.toHashKey(node)
    }

    if (
      !this.strict &&
      isListNode(predicates) &&
      !this.preserveListNodeProperties
    ) {
      const [first] = predicates.get(rdf.first)
      const [restNode] = predicates.get(rdf.rest)

      // top-level list node
      if (level === 0) {
        const rest = restNode.equals(rdf.nil)
          ? this.toHashKey(rdf.nil)
          : [...nestedObject(restNode)]

        return {
          [this.toHashKey(rdf.first)]: [nestedObject(first)],
          [this.toHashKey(rdf.rest)]: [rest],
        }
      }

      if (restNode.equals(rdf.nil)) {
        return [nestedObject(first)]
      }

      const rest = nestedObject(restNode)
      return [nestedObject(first), ...rest]
    }

    return [...predicates].reduce((map, [predicate, objects]) => {
      const propertyKey = this.toHashKey(predicate)

      const objectMaps = objects.map(nestedObject.bind(this))

      return {
        ...map,
        [propertyKey]: objectMaps,
      }
    }, {})
  }

  getGraph(graph) {
    const nodes = this.graphs.get(graph) || new TermMap()
    this.graphs.set(graph, nodes)
    return nodes
  }

  literalHash(term) {
    if (term.datatype && !this.strict) {
      switch (term.datatype.value) {
        case xsd.integer.value: {
          const number = +term.value
          if (Number.isInteger(number)) {
            return number
          }
          break
        }
        case xsd.decimal.value: {
          const dec = +term.value
          if (!Number.isNaN(dec) && !Number.isInteger(dec)) {
            return dec
          }
          break
        }
        case xsd.boolean.value: {
          if (term.value === 'true') {
            return true
          }
          if (term.value === 'false') {
            return false
          }
          break
        }
        default:
      }
    }

    return graphy.fromTerm(term).concise(this.prefixes)
  }

  toHashKey(term) {
    if (term.termType === 'Literal') {
      return this.literalHash(term)
    }

    if (term.equals(rdf.type)) {
      return 'a'
    }

    return graphy.fromTerm(term).concise(this.prefixes)
  }
}
