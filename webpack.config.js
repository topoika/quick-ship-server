const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  externals: [nodeExternals()], // To exclude node_modules from the bundle
  mode: "production", // Set to 'development' or 'production'
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // Use ts-loader to handle them
        exclude: /node_modules/, // Exclude dependencies
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
  },
  output: {
    filename: "bundle.js", // The output bundle file
    path: path.resolve(__dirname, "dist"), // Output directory
  },
};
