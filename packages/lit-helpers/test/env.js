import Environment from '@rdfjs/environment/Environment.js'
import { RdfsFactory } from '@rdfine/rdfs/Factory'
import { RdfineFactory } from '@tpluscode/rdfine'
import DataFactory from '@rdfjs/data-model/Factory.js'

export default new Environment([RdfineFactory, RdfsFactory, DataFactory])
