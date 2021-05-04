import stream from 'readable-stream'
import { defaultGraphInstance } from '@rdf-esm/data-model'
import { rdf, xsd } from '@tpluscode/rdf-ns-builders'
import TermMap from '@rdf-esm/term-map'

function shrink(iri, prefixMap) {
  const candidates = Array.from(
    Object.entries(prefixMap)
  ).filter(([, baseIRI]) => iri.startsWith(baseIRI))
  if (candidates.length) {
    candidates.sort(([, iri1], [, iri2]) => iri2.length - iri1.length)
    const found = candidates[0]
    return iri.replace(new RegExp(`^${found[1]}`), `${found[0]}:`)
  }
  return ''
}

export class TransformToConciseHash extends stream.Transform {
  constructor({ prefixes = {}, strict = false } = {}) {
    super({ objectMode: true })

    this.prefixes = prefixes
    this.graphs = new TermMap()
    this.blankNodes = new TermMap()
    this.strict = strict
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

  createPropertyMap(graph, predicates) {
    const nestedObject = node => {
      if (!this.strict && this.blankNodes.get(node) === 1) {
        const entry = this.graphs.get(graph).get(node)

        if (entry) {
          return this.createPropertyMap(graph, entry.predicates)
        }
      }

      return this.toHashKey(node)
    }

    if (
      !this.strict &&
      predicates.size === 2 &&
      predicates.has(rdf.first) &&
      predicates.has(rdf.rest)
    ) {
      const [first] = predicates.get(rdf.first)
      const [restNode] = predicates.get(rdf.rest)

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

  toHashKey(term) {
    if (term.termType === 'BlankNode') {
      return `_:${term.value}`
    }

    if (term.termType === 'Literal') {
      if (term.language) {
        return `@${term.language}"${term.value}`
      }

      if (term.datatype && !term.datatype.equals(xsd.string)) {
        return `^${this.toHashKey(term.datatype)}"${term.value}`
      }

      return `"${term.value}`
    }

    if (term.equals(defaultGraphInstance)) {
      return '*'
    }

    if (term.equals(rdf.type)) {
      return 'a'
    }

    const shrunk = shrink(term.value, this.prefixes)
    if (shrunk) {
      return shrunk
    }

    return `>${term.value}`
  }
}
