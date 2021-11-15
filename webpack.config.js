const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/QrDetector.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'QrDetector.min.js',
    library: {
      type: 'window',
      name: 'QrDetector',
      export: 'default',
    },
  },
  // optimization: {
  //   minimize: false,
  //   mangleExports: false,
  // },
};
