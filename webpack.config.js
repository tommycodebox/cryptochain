const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  name: 'deployment',
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /dist/, /build/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
    usedExports: true,
  },
  plugins: [new NodemonPlugin()],
  externals: [nodeExternals()],
}
