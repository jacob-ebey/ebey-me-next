const path = require("path");

const webpack = require("webpack");

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";

/** @type {import("webpack").Configuration} */
const config = {
  mode,
  devtool: "inline-source-map",
  output: {
    filename: "worker.js",
    path: path.join(__dirname, "dist"),
  },
};

module.exports = config;
