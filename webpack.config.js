const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts',
    content: './src/content.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
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
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.', globOptions: { ignore: ['**/style.css'] } }
      ]
    })
  ]
};
