import { serializers } from '@rdf-esm/formats-common'
import { schema } from '@tpluscode/rdf-ns-builders'

export { serializers, parsers } from '@rdf-esm/formats-common'

serializers.set('text/n3', async () => {
  const writer = (await import('@graphy/content.ttl.write')).default

  return {
    import(quadStream) {
      const turtleWriter = writer({
        prefixes: {
          schema: schema().value,
        },
      })
      turtleWriter.import(quadStream)

      return turtleWriter
    },
  }
})
