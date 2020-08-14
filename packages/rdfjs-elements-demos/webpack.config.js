const path = require('path')
const config = require('../../webpack.config')

module.exports = config({
  input: path.resolve(__dirname, './index.html'),
  output: path.resolve(__dirname, '../../dist/converter'),
})
