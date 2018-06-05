var webpack = require('webpack')
var path = require('path')
var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackConfig = new HTMLWebpackPlugin({
  template: __dirname + '/app/index.html'
  ,filename: 'index.html'
  ,inject: 'head'
})
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ExtractTextConfig = new ExtractTextPlugin('styles.css')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var OptimizeCssAssetsConfig = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /.css$/
  ,cssProcessor: require('cssnano')
  ,cssProcessorOptions: {discardComments: {removeAll:true}}
  ,canPrint: true
})
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var UglifyJSConfig = new UglifyJSPlugin({
  test: /\.js($|\?)/i
  ,uglifyOptions:{
    dead_code:true
    ,output: {
      comments:false
      ,beautify:false
    }
  }
  // ,extractComments:true
})
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ROUTE_PATH = "/projects/d3"


module.exports = (env, argv) => {
  let mode = argv.mode
  let routerPath = mode === "development" ? "/" : ROUTE_PATH
  let externals = mode === "development" ? {} : {
    react: 'React'
    ,'react-dom': 'ReactDOM'
  }

  console.log("router path:",routerPath)

  const basename = new webpack.DefinePlugin({
      BASENAME: JSON.stringify(routerPath)
    })

  return {
    mode: mode

    ,entry: __dirname + '/app/index.js'

    ,resolve: {
      alias: {
        App: path.resolve(__dirname,'app/')
        ,TDF: path.resolve(__dirname,'app/tdf/')
        ,Components: path.resolve(__dirname, 'app/components')
        ,Helpers: path.resolve(__dirname, 'app/helpers')
        ,Main: path.resolve(__dirname, 'app/main')
      }
      // ,extensions: ['.js', '.jsx', '.png', '']
    }

    ,module: {
      rules: [

        //babel
        { test: /\.js$/
          ,exclude: /node_modules/
          ,loader: 'babel-loader'
          // ,query: {presets: ['env', 'react']}
        }

        //process css
        ,{ test: /\.css$/
          ,exclude: /node_modules/
          ,use: ExtractTextPlugin.extract({fallback: 'style-loader', use:'css-loader'})
        }

        //scss
        ,{ test: /\.(scss)$/
          ,exclude: /node_modules/
          ,use: ExtractTextPlugin.extract({
            fallback: 'style-loader' // inject CSS to page
            ,use: [
                    {loader: 'css-loader'} // translates CSS into CommonJS modules
                    ,{loader: 'postcss-loader' // Run post css actions
                      ,options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                          return [
                            require('precss'),
                            require('autoprefixer')
                          ];
                        }
                      }
                    }
                    ,{loader: 'sass-loader'} // compiles Sass to CSS
                ]
              })
          }

          //images
          ,{
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          }

          //text files
          ,{
            test: /\.txt$/,
            use: 'raw-loader'
          }

      ] // end of rules
    } //end of module

    ,externals: externals

    ,output: {
      filename: 'index.js'
      ,path: __dirname + '/build'
    }

    ,plugins: [
      HTMLWebpackConfig
      ,ExtractTextConfig
      ,UglifyJSConfig
      ,new BundleAnalyzerPlugin()
      ,basename
    ]
  }

}
