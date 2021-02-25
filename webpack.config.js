const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const favicons = require('favicons-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    // '@babel/polyfill',
    path.resolve(__dirname, 'src', 'index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
  },
  devServer: {
    // clientLogLevel: 'none',
    // quiet: true,
    // contentBase: path.resolve(__dirname, 'src'),
    // watchContentBase: true,
    inline: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    overlay: true,
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
    }),
    new FriendlyErrorsWebpackPlugin(),
    new ErrorOverlayPlugin(),
    new favicons({
      logo: './favicon.png',
      favicons: {
        appName: 'Fractal viewer',
        appDescription: 'Application for interacting with the Mandelbrot and Julia sets',
        background: '#000',
        theme_color: '#000',
        icons: {
          coast: false,
          yandex: false
        }
      }
    }),
  ]
};