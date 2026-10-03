const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
class PublicAssetsPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('PublicAssetsPlugin', () => {
      fs.cpSync(path.resolve(__dirname, 'public'), path.resolve(__dirname, 'dist/public'), { recursive: true });
    });
  }
}
module.exports = {
  entry: './js/script.js',
  output: { filename: 'bundle.[contenthash].js', path: path.resolve(__dirname, 'dist'), clean: true },
  module: { rules: [{ test: /\.css$/i, use: ['style-loader', 'css-loader'] }] },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' }), new PublicAssetsPlugin()],
  devServer: { static: './', port: 3014, hot: true, open: false },
  mode: 'production',
};
