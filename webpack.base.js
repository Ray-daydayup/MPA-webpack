const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/pages/*/index.js'))
  entryFiles.forEach((item) => {
    const pageName = item.match(/pages\/(.*)\/index.js/)[1]
    entry[pageName] = item
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `./src/pages/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        favicon: path.join(__dirname, './src/assets/favicon.ico'),
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      })
    )
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

const baseModuleRules = [
  {
    test: /\.js$/,
    use: ['babel-loader', 'eslint-loader']
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          esModule: false,
          name: '[name][hash:8].[ext]',
          limit: 10240,
          outputPath: './assets/images/'
        }
      }
    ]
  }
]

const basePlugins = [...htmlWebpackPlugins, new CleanWebpackPlugin()]
module.exports = {
  entry,
  baseModuleRules,
  basePlugins
}
