const path = require('path');

module.exports = {
  mode: 'development', 
  entry: {
    index: './app/src/main/webapp/resources/ts/index/index.ts',
    main: './app/src/main/webapp/resources/ts/main/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'app/src/main/webapp/resources/js'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'], 
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
