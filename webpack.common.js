const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // appelés en ordre inverse
          "style-loader", // 3. Inject styles into DOM
          "css-loader",  // 2, Turn css into common js
          "sass-loader", // 1. Turn sass into css
        ]
      }
    ]
  }
}
