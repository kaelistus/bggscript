// Imports
const path = require('path');
require("@babel/register");// Webpack Configuration

const babelPresetEnvOptions = {
  targets: {
    esmodules: true
  },
  useBuiltIns: false,
  // we use fast-async, it's faster than regenerator
  exclude: ['transform-async-to-generator', 'transform-regenerator']
}

const config = {  // Entry
  mode: 'development',
  entry: './source/index.ts',
  // Output
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', babelPresetEnvOptions]]
            }
          },
          { loader: 'ts-loader' }
        ]}, 
      {
        test: /\.jsx?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }, {
        test: '/\.css$/',
        loader: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
};

module.exports = config;