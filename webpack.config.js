const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, 'src', 'index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
  },
  devServer: {
    // quiet: true,
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true,
    // inline: true,
    // hot: true,
    // compress: true,
    port: 3000,

    // Show client errors in browser
    overlay: {
      warnings: true,
      errors: true
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
          ]
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: true
    }),
    // new FriendlyErrorsWebpackPlugin(),
    new ErrorOverlayPlugin()
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       context: path.resolve(__dirname, 'src/wasm/'),
    //       from: '*.wasm',
    //       to: path.resolve(__dirname, 'dist/wasm') },
    //   ]
    // }),
  ]
};