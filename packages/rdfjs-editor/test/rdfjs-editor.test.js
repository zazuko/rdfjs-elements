import { html, fixture, expect } from '@open-wc/testing';

import '../rdfjs-editor.js';

describe('RdfjsEditor', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html` <rdfjs-editor></rdfjs-editor> `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html` <rdfjs-editor></rdfjs-editor> `);
    el.shadowRoot.querySelector('button').click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <rdfjs-editor title="attribute title"></rdfjs-editor>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html` <rdfjs-editor></rdfjs-editor> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
