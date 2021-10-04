async function parser(module) {
  const create = (await module).default

  return {
    import(quadStream, options) {
      return quadStream.pipe(options ? create(options) : create())
    },
  }
}

export const trig = () => parser(import('@graphy/content.trig.read'))
export const nq = () => parser(import('@graphy/content.nq.read'))
