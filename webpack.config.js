const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

function setupDevtool(){
  if (IS_DEV) {
      return 'eval';
  }
  if (IS_PROD) {
      return false;
  }
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
        publicPath: '/'
    },
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      historyApiFallback: true,
    },
    module: {
      rules : [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules'
        },
        {
          test: /^((?!\.module).)*css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]__[sha1:hash:hex:7]'
                }
              }
            }
          ]
        }
      ]
    },
    devtool: setupDevtool(),
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'main.css'
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/components/boards/boards.html'), 
        filename: 'index.html'
    }),
    ]
}