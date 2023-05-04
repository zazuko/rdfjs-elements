import EnvironmentMixin from '@rdfjs-elements/editor-base/EnvironmentMixin'
import Environment from '@rdfjs/environment'
import FormatsFactory from '@rdfjs/environment/FormatsFactory'
import DataFactory from '@rdfjs/environment/DataFactory'
import formats from '@rdfjs-elements/formats-pretty'
import { RdfEditor } from './src/RdfEditor.js'

const $rdf = new Environment([FormatsFactory, DataFactory])
$rdf.formats.import(formats)

window.customElements.define(
  'rdf-editor',
  class extends EnvironmentMixin(RdfEditor, $rdf) {}
)
