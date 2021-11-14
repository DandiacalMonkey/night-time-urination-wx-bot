// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    devtoolModuleFilenameTemplate: info => {
      const resPath = info.resourcePath;
      if ((/\.vue$/.test(resPath) && !/type=script/.test(info.identifier)) || /node_modules/.test(resPath)) {
          return `webpack:///${resPath}?${info.hash}`
      }
      return `webpack:///${resPath}`.replace('./src', 'my-code/src')
    }
  },
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8090,
    proxy: {
      "/qyapi": {
        target: "https://qyapi.weixin.qq.com",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/qyapi": "" }
      }
    }
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProduction ? JSON.stringify("production") : JSON.stringify("development")
      }
    })

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
