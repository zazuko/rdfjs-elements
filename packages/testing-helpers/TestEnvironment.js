import Environment from '@rdfjs/environment/Environment.js'
import FormatsFactory from '@rdfjs/formats/Factory.js'
import DataFactory from '@rdfjs/data-model/Factory.js'

export default () => new Environment([FormatsFactory, DataFactory])
