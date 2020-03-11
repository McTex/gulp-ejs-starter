import path from 'path';
import glob from 'glob';

// const path = require('path');
// const glob = require('glob');

module.exports = {
  entry: glob.sync('./src/**/**/js'),
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
    ]
  }
};
