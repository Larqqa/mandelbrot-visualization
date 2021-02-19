const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].min.js',
  },
  devServer: {
    contentBase: path.join(__dirname, './src'),
    inline: true,
    hot: true,
    watchContentBase: true,
    compress: true,
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
        loader: "html-loader"
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
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      inject: true
    }),
  ],
};