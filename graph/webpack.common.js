const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: __dirname + "/src/js/main.js",
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          mimetype: "application/octet-stream",
        },
      },
    ],
  },
};
