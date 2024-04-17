import Environment from '@zazuko/env/Environment.js'
import parent from '@zazuko/env/web.js'
import { RdfsFactory } from '@rdfine/rdfs/Factory'
import { RdfineFactory } from '@tpluscode/rdfine'

export default new Environment([RdfineFactory, RdfsFactory], { parent })
