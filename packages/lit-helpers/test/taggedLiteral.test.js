import { html, fixture, expect, nextFrame } from '@open-wc/testing'
import clownface from 'clownface'
import $rdf from '@rdfjs/dataset'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { fromPointer } from '@rdfine/rdfs/lib/Resource'
import { taggedLiteral, setLanguages } from '../taggedLiteral.js'

describe('@rdfjs-elements/lit-helpers/taggedLiteral.js', () => {
  it("renders pointer's rdfs:label property in preferred language", async () => {
    // given
    const pointer = clownface({ dataset: $rdf.dataset() }).blankNode()
    pointer
      .addOut(rdfs.label, pointer.literal('Apfel', 'de'))
      .addOut(rdfs.label, pointer.literal('Apple', 'en'))
      .addOut(rdfs.label, pointer.literal('Jabłko', 'pl'))
    setLanguages('pl')

    // when
    const el = await fixture(html`<span>${taggedLiteral(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Jabłko</span>`)
  })

  it('skips languages not found', async () => {
    // given
    const pointer = clownface({ dataset: $rdf.dataset() }).blankNode()
    pointer
      .addOut(rdfs.label, pointer.literal('Apfel', 'de'))
      .addOut(rdfs.label, pointer.literal('Apple', 'en'))
      .addOut(rdfs.label, pointer.literal('Jabłko', 'pl'))
    setLanguages('fr', 'pl')

    // when
    const el = await fixture(html`<span>${taggedLiteral(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Jabłko</span>`)
  })

  it('falls back to any language when no matching tag is found', async () => {
    // given
    const pointer = clownface({ dataset: $rdf.dataset() }).blankNode()
    pointer.addOut(rdfs.label, pointer.literal('Apfel', 'de'))
    setLanguages('fr', 'pl')

    // when
    const el = await fixture(html`<span>${taggedLiteral(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Apfel</span>`)
  })

  it('works with rdfine object', async () => {
    // given
    const pointer = clownface({ dataset: $rdf.dataset() }).blankNode()
    const resource = fromPointer(pointer, {
      label: 'Apple',
    })

    // when
    const el = await fixture(html`<span>${taggedLiteral(resource)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Apple</span>`)
  })

  it('updates existing usages when language is changed', async () => {
    // given
    const pointer = clownface({ dataset: $rdf.dataset() })
    const apple = pointer
      .blankNode()
      .addOut(rdfs.label, pointer.literal('Apple', 'en'))
      .addOut(rdfs.label, pointer.literal('Jabłko', 'pl'))
    const orange = pointer
      .blankNode()
      .addOut(rdfs.label, pointer.literal('Orange', 'en'))
      .addOut(rdfs.label, pointer.literal('Pomarańcza', 'pl'))
    setLanguages('pl')

    // when
    const el = await fixture(html`<p>
      <span>${taggedLiteral(apple)}</span>
      <span>${taggedLiteral(orange)}</span>
    </p>`)
    await nextFrame()
    setLanguages('en', 'pl')
    await nextFrame()

    // then
    expect(el).dom.to.equal(`<p><span>Apple</span><span>Orange</span></p>`)
  })
})
