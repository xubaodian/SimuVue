const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index:  path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'simu.vue.min.js',
    //接口暴露变量名称
    library: {
      root: "Simuvue",
      amd: "Simuvue",
      commonjs: "Simuvue"
    },
    libraryTarget: "umd"
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
      }
    ]
  }
};