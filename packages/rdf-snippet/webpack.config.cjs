const path = require('path')
const config = require('../../webpack.config.cjs')

module.exports = config({
  input: path.resolve(__dirname, './demo/index.html'),
  output: path.resolve(__dirname, '../../dist/rdf-snippet'),
  options: {
    webpackIndexHTMLPlugin: {
      minify: false,
    },
  },
})
