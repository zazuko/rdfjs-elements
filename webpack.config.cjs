/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = ({ input, output, contentBase, options = {} }) =>
  merge(
    createDefaultConfig({
      input,
      ...options,
    }),
    {
      output: {
        path: output,
      },
      resolve: {
        extensions: ['.ts', '.mjs', '.js', '.json'],
        alias: {
          stream: 'readable-stream',
        },
      },
      module: {
        rules: [
          {
            test: /\.nq$/,
            use: ['raw-loader'],
          },
          {
            test: /\.ttl$/,
            use: ['raw-loader'],
          },
        ],
      },
      node: {
        crypto: true,
      },
      devServer: {
        contentBase,
        watchContentBase: true,
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              from: './custom-elements.json',
              noErrorOnMissing: true,
            },
          ],
        }),
      ],
    }
  )
