import { expect } from 'chai'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import { rdf, schema, xsd } from '@tpluscode/rdf-ns-builders'
import namespace from '@rdfjs/namespace'
import { TransformToConciseHash } from '../../serializers/TransformToConciseHash.js'

const ex = namespace('http://example.com/')

function transform(graph, prefixes, strict = false) {
  return new Promise(resolve => {
    const output = new TransformToConciseHash({ prefixes, strict })
    graph.dataset.toStream().pipe(output)
    output.on('data', resolve)
  })
}

describe('@rdfjs-elements/formats-pretty/serializers/TransformToConciseHash', () => {
  it('creates hash for default graph', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.john)
      .addOut(rdf.type, schema.Person)

    // when
    const hash = await transform(graph)

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          '>http://example.com/john': {
            a: ['>http://schema.org/Person'],
          },
        },
      },
    })
  })

  it('creates hash for named graph', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset(), graph: ex.john })
      .namedNode(ex.john)
      .addOut(rdf.type, schema.Person)

    // when
    const hash = await transform(graph)

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '>http://example.com/john': {
          '>http://example.com/john': {
            a: ['>http://schema.org/Person'],
          },
        },
      },
    })
  })

  it('abbreviates terms in known namespaces', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset(), graph: ex.john })
      .namedNode(ex.john)
      .addOut(rdf.type, schema.Person)

    // when
    const hash = await transform(graph, {
      schema: schema().value,
      ex: ex().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        'ex:john': {
          'ex:john': {
            a: ['schema:Person'],
          },
        },
      },
    })
  })

  it('handles various literals', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset(), graph: ex.john })
      .namedNode(ex.john)
      .addOut(schema.name, 'John')
      .addOut(schema.title, $rdf.literal('Phd', 'en'))
      .addOut(schema.age, $rdf.literal('45', xsd.integer))
      .addOut(schema.contentSize, $rdf.literal('bogus', xsd.integer))
      .addOut(schema.height, $rdf.literal('170.5', xsd.decimal))
      .addOut(schema.length, $rdf.literal('170,5', xsd.decimal))
      .addOut(schema.size, $rdf.literal('170', xsd.decimal))
      .addOut(schema.baseSalary, $rdf.literal('4500', xsd.int))
      .addOut(schema.isFamilyFriendly, [
        $rdf.literal('true', xsd.boolean),
        $rdf.literal('false', xsd.boolean),
        $rdf.literal('maybe', xsd.boolean),
      ])

    // when
    const hash = await transform(graph, {
      schema: schema().value,
      ex: ex().value,
      xsd: xsd().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        'ex:john': {
          'ex:john': {
            'schema:name': ['"John'],
            'schema:title': ['@en"Phd'],
            'schema:age': [45],
            'schema:contentSize': ['^xsd:integer"bogus'],
            'schema:height': [170.5],
            'schema:length': ['^xsd:decimal"170,5'],
            'schema:size': ['^xsd:decimal"170'],
            'schema:baseSalary': ['^xsd:int"4500'],
            'schema:isFamilyFriendly': [true, false, '^xsd:boolean"maybe'],
          },
        },
      },
    })
  })

  describe('strict mode', () => {
    it('does not inline blank nodes', async () => {
      // given
      const graph = clownface({ dataset: $rdf.dataset(), graph: ex.john })
        .namedNode(ex.john)
        .addOut(ex.foo, $rdf.blankNode('foo'), foo => {
          foo.addOut(ex.bar, $rdf.blankNode('bar'), bar => {
            bar.addOut(ex.baz, $rdf.blankNode('baz'))
          })
        })

      // when
      const hash = await transform(
        graph,
        {
          ex: ex().value,
        },
        true
      )

      // then
      expect(hash).to.deep.contain({
        type: 'c4r',
        value: {
          'ex:john': {
            'ex:john': {
              'ex:foo': ['_:foo'],
            },
            '_:foo': {
              'ex:bar': ['_:bar'],
            },
            '_:bar': {
              'ex:baz': ['_:baz'],
            },
          },
        },
      })
    })

    it('does not inline RDF Lists', async () => {
      // given
      const graph = clownface({ dataset: $rdf.dataset() })
        .namedNode(ex.hasList)
        .addList(ex.list, ['A', 'B'])

      // when
      const hash = await transform(
        graph,
        {
          ex: ex().value,
          rdf: rdf().value,
        },
        true
      )

      // then
      expect(Object.keys(hash.value['*'])).to.have.length(3)
      expect(
        Object.keys(hash.value['*']['ex:hasList']['ex:list'])
      ).to.have.length(1)
    })

    it('returns c4r event', async () => {
      // given
      const graph = clownface({ dataset: $rdf.dataset() })
        .namedNode(ex.john)
        .addOut(rdf.type, schema.Person)

      // when
      const hash = await transform(
        graph,
        {
          ex: ex().value,
          rdf: rdf().value,
        },
        true
      )

      // then
      expect(hash.type).to.eq('c4r')
    })
  })

  it('inlines blank nodes', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset(), graph: ex.john })
      .namedNode(ex.john)
      .addOut(ex.foo, foo => {
        foo.addOut(ex.bar, bar => {
          bar.addOut(ex.baz, $rdf.blankNode('baz'))
        })
      })

    // when
    const hash = await transform(graph, {
      ex: ex().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        'ex:john': {
          'ex:john': {
            'ex:foo': [
              {
                'ex:bar': [
                  {
                    'ex:baz': ['_:baz'],
                  },
                ],
              },
            ],
          },
        },
      },
    })
  })

  it('does not inline blank nodes if they are used twice', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.count)
      .addOut(ex.one, $rdf.blankNode('mississippi'))
      .addOut(ex.two, $rdf.blankNode('mississippi'))
      .addOut(ex.three, $rdf.blankNode('mississippi'))
      .blankNode('mississippi')
      .addOut(rdf.type, schema.Place)

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      schema: schema().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:count': {
            'ex:one': ['_:mississippi'],
            'ex:two': ['_:mississippi'],
            'ex:three': ['_:mississippi'],
          },
          '_:mississippi': {
            a: ['schema:Place'],
          },
        },
      },
    })
  })

  it('inlines RDF List', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.hasList)
      .addList(ex.list, ['A', 'B', 'C'])

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      schema: schema().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:hasList': {
            'ex:list': [['"A', '"B', '"C']],
          },
        },
      },
    })
  })

  it('inlines RDF List with blank nodes inlined', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.hasList)
      .addList(ex.list, [
        $rdf.blankNode('foo'),
        $rdf.blankNode('bar'),
        $rdf.blankNode('baz'),
      ])
      .blankNode('foo')
      .addOut(rdf.type, ex.BlankNode)
      .blankNode('bar')
      .addOut(rdf.type, ex.BlankNode)
      .blankNode('baz')
      .addOut(rdf.type, ex.BlankNode)

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      schema: schema().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:hasList': {
            'ex:list': [
              [
                {
                  a: ['ex:BlankNode'],
                },
                {
                  a: ['ex:BlankNode'],
                },
                {
                  a: ['ex:BlankNode'],
                },
              ],
            ],
          },
        },
      },
    })
  })

  it('inlines RDF List with reused blank nodes', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.hasList)
      .addList(ex.list, [
        $rdf.blankNode('foo'),
        $rdf.blankNode('foo'),
        $rdf.blankNode('foo'),
        $rdf.blankNode('foo'),
        $rdf.blankNode('foo'),
      ])
      .blankNode('foo')
      .addOut(rdf.type, ex.BlankNode)

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      schema: schema().value,
    })

    // then
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:hasList': {
            'ex:list': [['_:foo', '_:foo', '_:foo', '_:foo', '_:foo']],
          },
          '_:foo': {
            a: ['ex:BlankNode'],
          },
        },
      },
    })
  })

  it('handles RDF lists shared by multiple subjects', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.foo)
      .addList(ex.list, ['a', 'b', 'c'])
    graph.namedNode(ex.bar).addOut(ex.list, graph.out(ex.list))
    graph.namedNode(ex.baz).addOut(ex.list, graph.out(ex.list))

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      rdf: rdf().value,
    })

    // then
    const listNode = `_:${graph.out(ex.list).value}`
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:foo': {
            'ex:list': [listNode],
          },
          'ex:bar': {
            'ex:list': [listNode],
          },
          'ex:baz': {
            'ex:list': [listNode],
          },
          [listNode]: {
            'rdf:first': ['"a'],
            'rdf:rest': [['"b', '"c']],
          },
        },
      },
    })
  })

  it('handles single-element RDF lists shared by multiple subjects', async () => {
    // given
    const graph = clownface({ dataset: $rdf.dataset() })
      .namedNode(ex.foo)
      .addList(ex.list, ['a'])
    graph.namedNode(ex.bar).addOut(ex.list, graph.out(ex.list))
    graph.namedNode(ex.baz).addOut(ex.list, graph.out(ex.list))

    // when
    const hash = await transform(graph, {
      ex: ex().value,
      rdf: rdf().value,
    })

    // then
    const listNode = `_:${graph.out(ex.list).value}`
    expect(hash).to.deep.contain({
      type: 'c4',
      value: {
        '*': {
          'ex:foo': {
            'ex:list': [listNode],
          },
          'ex:bar': {
            'ex:list': [listNode],
          },
          'ex:baz': {
            'ex:list': [listNode],
          },
          [listNode]: {
            'rdf:first': ['"a'],
            'rdf:rest': ['rdf:nil'],
          },
        },
      },
    })
  })
})
