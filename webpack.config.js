const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")

module.exports = {
  mode: "development",
  entry: "./src/index.js",
    output: {
      filename: "main[contentHash].js",
      path: path.resolve(__dirname, "dist")
    },
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
