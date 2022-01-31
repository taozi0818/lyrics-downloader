const path = require('path');

module.exports = {
  entry: './bin/start.js',
  mode: 'development',
  target: 'node5.12',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [ path.resolve(__dirname, 'node_modules') ],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-modules-commonjs'
            ],
          }
        }
      }
    ]
  }
};
