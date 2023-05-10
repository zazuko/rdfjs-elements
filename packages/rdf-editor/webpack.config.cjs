const path = require('path')
const config = require('../../webpack.config.cjs')
const url = require('url')

module.exports = config({
  input: path.resolve(__dirname, './demo/index.html'),
  output: path.resolve(__dirname, '../../dist/rdf-editor'),
  options: {
    webpackIndexHTMLPlugin: {
      minify: false,
    },
  },
})
