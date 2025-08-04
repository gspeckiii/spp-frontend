// =============================================================
// FINAL, CORRECTED webpack.config.js with CopyPlugin
// You can replace your entire file with this.
// =============================================================

const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const fse = require("fs-extra");
const CopyPlugin = require("copy-webpack-plugin"); // 1. Require the new plugin

const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

let cssConfig = {
  test: /\.css$/i,
  use: [
    currentTask === "build" || currentTask === "webpackBuild"
      ? MiniCssExtractPlugin.loader
      : "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        importLoaders: 1,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: postCSSPlugins,
        },
      },
    },
  ],
};

const htmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: "./app/index-template.html",
  alwaysWriteToDisk: true,
});

const config = {
  entry: "./app/assets/scripts/App.js",
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".env"),
      systemvars: true,
    }),
    htmlPlugin,
    new HtmlWebpackHarddiskPlugin(),

    // 2. Add the CopyPlugin to the plugins array.
    // This will copy your entire images folder structure.
    new CopyPlugin({
      patterns: [
        {
          from: "app/assets/images", // Source directory
          to: "assets/images", // Destination in the output folder (e.g., dist/assets/images)
        },
      ],
    }),
  ],
  module: {
    rules: [
      cssConfig,
      // This rule is still useful for images you `import` directly in JS or reference in CSS.
      // Webpack will process them and place them in the output directory.
      // The CopyPlugin handles everything else in the images folder.
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext][query]",
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "12" } }],
            ],
          },
        },
      },
    ],
  },
  output: {
    publicPath: "/",
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
    clean: true,
  },
  mode: "development",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".css"],
    alias: {
      images: path.resolve(__dirname, "app/assets/images"),
    },
  },
};

if (currentTask === "dev" || currentTask === "webpackDev") {
  config.devtool = "source-map";
  config.devServer = {
    port: 3000,
    hot: false,
    liveReload: true,
    static: {
      directory: path.join(__dirname, "app"),
    },
    historyApiFallback: true,
  };
}

if (currentTask === "build" || currentTask === "webpackBuild") {
  config.mode = "production";
  config.output = {
    publicPath: "/",
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: ["...", new CssMinimizerPlugin()],
  };
  // We can add CleanWebpackPlugin here for production builds.
  // Although `output.clean: true` does most of the work, this is an explicit safeguard.
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" })
  );
}

module.exports = config;
