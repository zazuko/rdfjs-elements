async function parser(module) {
  const create = (await module).default

  return {
    import(quadStream) {
      return quadStream.pipe(create())
    },
  }
}

export const trig = () => parser(import('@graphy/content.trig.read'))
export const nq = () => parser(import('@graphy/content.nq.read'))
