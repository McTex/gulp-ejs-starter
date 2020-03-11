import path from 'path';
import glob from 'glob';
import globEntries from 'webpack-glob-entries';

// const path = require('path');
// const glob = require('glob');

module.exports = {
  entry: globEntries('./src/assets/js/*.js'),
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname),
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      ]
    }]
  },
}
