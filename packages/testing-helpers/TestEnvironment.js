import Environment from '@rdfjs/environment/Environment.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import DataFactory from '@rdfjs/environment/DataFactory.js'

export default () => new Environment([FormatsFactory, DataFactory])
