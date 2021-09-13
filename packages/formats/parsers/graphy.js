async function parser(module) {
  const create = (await module).default

  return {
    import(quadStream, options) {
      return quadStream.pipe(create(options))
    },
  }
}

export const trig = () => parser(import('@graphy/content.trig.read'))
export const nq = () => parser(import('@graphy/content.nq.read'))
