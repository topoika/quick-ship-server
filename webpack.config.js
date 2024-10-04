const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts", // Entry file
  target: "node", // Ensure Webpack compiles for Node.js
  externals: [nodeExternals()], // Ignore node_modules in the output
  output: {
    filename: "bundle.js", // Output bundle file
    path: path.resolve(__dirname, "dist"), // Output folder
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve .ts and .js extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // Use ts-loader for TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
};
