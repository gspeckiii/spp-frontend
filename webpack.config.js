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
      fse.copySync("./app/assets/styles/main.css", "./dist/main.css")
      fse.copySync("./app/assets/images", "./dist/assets/images")
    })
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    currentTask === "build" || currentTask === "webpackBuild" ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        importLoaders: 1
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: postCSSPlugins
        }
      }
    }
  ]
}

const htmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: "./app/index-template.html",
  alwaysWriteToDisk: true
})

const config = {
  entry: "./app/assets/scripts/App.js",
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".env"),
      systemvars: true
    }),
    htmlPlugin,
    new HtmlWebpackHarddiskPlugin()
  ],
  module: {
    rules: [
      cssConfig,
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext][query]"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
    path: path.resolve(__dirname, "app"),
    clean: true
  },
  mode: "development",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".css"]
  }
}

if (currentTask === "dev" || currentTask === "webpackDev") {
  config.devtool = "source-map"
  config.devServer = {
    port: 3000,
    static: {
      directory: path.join(__dirname, "app"),
      publicPath: "/"
    },
    hot: false, // Disable HMR to avoid sign-in/out issue
    liveReload: true,
    historyApiFallback: { index: "/index.html" },
    watchFiles: ["app/**/*.js", "app/**/*.jsx", "app/**/*.css"]
  }
}

if (currentTask === "build" || currentTask === "webpackBuild") {
  config.mode = "production"
  config.output = {
    publicPath: "/",
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  }
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: ["...", new CssMinimizerPlugin()]
  }
  config.plugins.push(new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }), new RunAfterCompile())
}

module.exports = config
