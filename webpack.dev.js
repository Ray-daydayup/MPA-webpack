const webpack = require('webpack')
const path = require('path')
const { entry, baseModuleRules, basePlugins } = require('./webpack.base.js')

module.exports = {
  mode: 'development',
  entry,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      ...baseModuleRules,
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    // 设置别名
    alias: {
      '@': path.join(__dirname, 'src') // 这样配置后 @ 可以指向 src 目录
    }
  },
  plugins: [...basePlugins, new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: 'dist',
    hot: true,
    proxy: {
      '/api': {
        target: 'http://raydaydayup.cn:3000',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
