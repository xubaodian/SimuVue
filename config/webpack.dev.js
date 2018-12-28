const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index:  path.resolve(__dirname, '../demo/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'bundle.js'
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    hot: true,//热重载
    disableHostCheck: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,//启用gzip压缩
    host: '127.0.0.1',
    port: 20000,  //端口号
    open: true,  //自动打开浏览器
    overlay: false,
    publicPath: '/',
    proxy: {},  //代理地址
    quiet: true, // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。使用FriendlyErrorsPlugin插件时，设置为true
    watchOptions: { //监视文件是否有改动，也可改为定期轮询文件
      poll: false,
    }
  },
  module: {
    rules: [
      { 
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        } 
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('lib', '/img/[name].[hash:7].[ext]')
        }
      },
      //视频编译
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('lib', '/media/[name].[hash:7].[ext]')
        }
      },
       //视频编译
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('lib', '/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
     //热重载
     new webpack.HotModuleReplacementPlugin(),
     new webpack.NamedModulesPlugin(),
     //处理html
     new HtmlWebpackPlugin({
       filename: 'index.html',
       template: './demo/index.html',
       inject: true
     }),
     new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://localhost:20000`],
      }
    })
  ]
};