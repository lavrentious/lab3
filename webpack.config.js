const path = require('path');

module.exports = {
  entry: './app/src/main/webapp/resources/ts/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/src/main/webapp/resources/js'),
  },
  mode: 'development'
};