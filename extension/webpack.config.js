var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/content',
    './src/background'
  ],
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        test: /\.js$/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
