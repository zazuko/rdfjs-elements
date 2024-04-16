import { html, fixture, expect, nextFrame } from '@open-wc/testing'
import { rdfs, sh, skos } from '@tpluscode/rdf-ns-builders'
import { setLanguages } from '../index.js'
import { localizedLabel } from '../localizedLabel.js'
import env from './env.js'

describe('@rdfjs-elements/lit-helpers/localizedLabel.js', () => {
  it("renders pointer's rdfs:label property in preferred language", async () => {
    // given
    const pointer = env.clownface().blankNode()
    pointer
      .addOut(rdfs.label, pointer.literal('Apfel', 'de'))
      .addOut(rdfs.label, pointer.literal('Apple', 'en'))
      .addOut(rdfs.label, pointer.literal('Jabłko', 'pl'))
    setLanguages('pl')

    // when
    const el = await fixture(html`<span>${localizedLabel(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Jabłko</span>`)
  })

  it('skips languages not found', async () => {
    // given
    const pointer = env.clownface().blankNode()
    pointer
      .addOut(rdfs.label, pointer.literal('Apfel', 'de'))
      .addOut(rdfs.label, pointer.literal('Apple', 'en'))
      .addOut(rdfs.label, pointer.literal('Jabłko', 'pl'))
    setLanguages('fr', 'pl')

    // when
    const el = await fixture(html`<span>${localizedLabel(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Jabłko</span>`)
  })

  it('falls back to any language when no matching tag is found', async () => {
    // given
    const pointer = env.clownface().blankNode()
    pointer.addOut(rdfs.label, pointer.literal('Apfel', 'de'))
    setLanguages('fr', 'pl')

    // when
    const el = await fixture(html`<span>${localizedLabel(pointer)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Apfel</span>`)
  })

  it('works with rdfine object', async () => {
    // given
    const pointer = env.clownface().blankNode()
    const resource = env.rdfine.rdfs.Resource(pointer, {
      label: 'Apple',
    })

    // when
    const el = await fixture(html`<span>${localizedLabel(resource)}</span>`)

    // then
    expect(el).dom.to.equal(`<span>Apple</span>`)
  })

  it('updates existing usages when language is changed', async () => {
    // given
    const pointer = env.clownface()
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
      <span>${localizedLabel(apple)}</span>
      <span>${localizedLabel(orange)}</span>
    </p>`)
    await nextFrame()
    setLanguages('en', 'pl')
    await nextFrame()

    // then
    expect(el).dom.to.equal(`<p><span>Apple</span><span>Orange</span></p>`)
  })

  it('updates existing fallback usages when language is changed', async () => {
    // given
    const pointer = env.clownface()
    const fruit = pointer.blankNode()

    // when
    const el = await fixture(
      html`<span>${localizedLabel(fruit, { fallback: 'a fruit' })}</span>`
    )
    await nextFrame()
    setLanguages('en')
    await nextFrame()

    // then
    expect(el).dom.to.equal(`<span>a fruit</span>`)
  })

  it('renders fallback when no label is found', async () => {
    // given
    const pointer = env.clownface()
    const res = pointer.blankNode()

    // when
    const el = await fixture(
      html`<span>${localizedLabel(res, { fallback: 'Fallback' })}</span>`
    )

    // then
    expect(el).dom.to.equal(`<span>Fallback</span>`)
  })

  it('supports changing the label property', async () => {
    // given
    const pointer = env.clownface().addOut(sh.name, 'Property')
    const res = pointer.blankNode()

    // when
    const el = await fixture(
      html`<span
        >${localizedLabel(res, {
          property: sh.name,
          fallback: 'Fallback',
        })}</span
      >`
    )

    // then
    expect(el).dom.to.equal(`<span>Fallback</span>`)
  })

  it('supports multiple alternative label properties', async () => {
    // given
    const pointer = env.clownface().blankNode()
    pointer.addOut(skos.altLabel, pointer.literal('Malus domestica'))

    // when
    const el = await fixture(
      html`<span
        >${localizedLabel(pointer, {
          property: [skos.prefLabel, skos.altLabel],
          fallback: 'wrong',
        })}</span
      >`
    )

    // then
    expect(el).dom.to.equal(`<span>Malus domestica</span>`)
  })
})
