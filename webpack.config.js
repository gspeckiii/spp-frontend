// === FINAL, DEFINITIVE, AND CORRECT webpack.config.js ===

// This MUST be at the very top to load variables from your .env file
require("dotenv").config();

const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = "mini-css-extract-plugin"; // Use string to avoid error if not installed
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy static assets", function () {
      fse.copySync("./app/assets/images", "./dist/assets/images");
    });
  }
}

// --- THIS IS THE CRITICAL PLUGIN DEFINITION ---
// We define it once, here, to ensure it's identical everywhere.
const stripePlugin = new webpack.DefinePlugin({
  "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(
    process.env.STRIPE_PUBLISHABLE_KEY
  ),
});

// --- Webpack Configuration ---
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  let cssRule = {
    test: /\.css$/i,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: { postcssOptions: { plugins: postCSSPlugins } },
      },
    ],
  };

  let plugins = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./app/index-template.html",
    }),
    stripePlugin, // Add the plugin to the base array
  ];

  if (isProduction) {
    // Modify the CSS rule for production
    cssRule.use[0] = require(MiniCssExtractPlugin).loader;

    // Add production-specific plugins
    plugins.push(
      new CleanWebpackPlugin(),
      new (require(MiniCssExtractPlugin))({
        filename: "styles.[chunkhash].css",
      }),
      new RunAfterCompile()
    );
  }

  return {
    entry: "./app/assets/scripts/App.js",
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? undefined : "source-map",

    output: {
      publicPath: "/",
      path: isProduction
        ? path.resolve(__dirname, "dist")
        : path.resolve(__dirname, "app"),
      filename: isProduction ? "[name].[chunkhash].js" : "bundled.js",
      chunkFilename: isProduction ? "[name].[chunkhash].js" : undefined,
    },

    plugins: plugins, // Use the final plugins array

    module: {
      rules: [
        cssRule,
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react", "@babel/preset-env"] },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: { filename: "assets/images/[name][hash][ext]" },
        },
      ],
    },

    resolve: {
      extensions: [".js", ".jsx"],
      alias: { "~images": path.resolve(__dirname, "app/assets/images") },
    },

    devServer: isProduction
      ? undefined
      : {
          port: 3000,
          static: { directory: path.join(__dirname, "app") },
          historyApiFallback: true,
          hot: false,
        },

    optimization: isProduction
      ? {
          splitChunks: { chunks: "all" },
          minimize: true,
          minimizer: [`...`, new CssMinimizerPlugin()],
        }
      : undefined,
  };
};
