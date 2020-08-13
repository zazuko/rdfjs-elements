const path = require('path')
const config = require('../../webpack.config')

module.exports = config({
  input: path.resolve(__dirname, './demo/index.html'),
  output: path.resolve(__dirname, '../../dist/rdf-editor'),
})
