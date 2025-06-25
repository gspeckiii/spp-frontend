const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const Dotenv = require("dotenv-webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")
const fse = require("fs-extra")

const postCSSPlugins = [require("postcss-import"), require("postcss-mixins"), require("postcss-simple-vars"), require("postcss-nested"), require("autoprefixer")]

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy files", () => {
      fse.copySync("./app/main.css", "./dist/main.css")
      fse.copySync("./app/assets/images", "./dist/assets/images")
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    "style-loader", // Move style-loader here for dev to ensure HMR
    {
      loader: "css-loader",
      options: {
        url: false, // Keep url=false as per your config
        sourceMap: true, // Enable source maps for debugging
        importLoaders: 1 // Ensure postcss-loader processes @import
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true, // Enable source maps
        postcssOptions: { plugins: postCSSPlugins }
      }
    }
  ]
}

const htmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: "./app/index-template.html", // Ensure this file exists
  alwaysWriteToDisk: true
})

const config = {
  entry: "./app/assets/scripts/App.js",
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".env"),
      debug: true
    }),
    htmlPlugin,
    new HtmlWebpackHarddiskPlugin()
  ],
  module: {
    rules: [
      cssConfig,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]]
          }
        }
      }
    ]
  },
  output: {
    publicPath: "/",
    filename: "bundled.js",
    path: path.resolve(__dirname, "app")
  },
  mode: "development"
}

if (currentTask === "dev" || currentTask === "webpackDev") {
  config.devtool = "source-map"
  config.devServer = {
    port: 3000,
    static: {
      directory: path.join(__dirname, "app")
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: "index.html" },
    watchFiles: ["app/**/*.js", "app/**/*.css"] // Watch CSS files explicitly
  }
}

if (currentTask === "build" || currentTask === "webpackBuild") {
  cssConfig.use = [
    MiniCssExtractPlugin.loader, // Replace style-loader for production
    {
      loader: "css-loader",
      options: {
        url: false,
        sourceMap: true
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: { plugins: postCSSPlugins }
      }
    }
  ]
  config.mode = "production"
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist")
  }
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: ["...", new CssMinimizerPlugin()]
  }
  config.plugins.push(new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }), new RunAfterCompile())
}

module.exports = config
