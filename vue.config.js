const path = require('path');
const { defineConfig } = require('@vue/cli-service')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
   
    productionSourceMap: false,
    transpileDependencies: true,
    configureWebpack: {
        
      performance: {
        maxEntrypointSize: 1000000,
        maxAssetSize: 1000000,
      },
      optimization: {
          minimize: true,
          minimizer: [
              new TerserPlugin({
                  terserOptions: {
                      ecma: undefined,
                      parse: {},
                      compress: {},
                      mangle: true,
                      module: false
                  }
              })
          ],
          splitChunks: {
            chunks: 'all',
            minSize: 1000000,
            maxSize: 1000000,
          }
     
      },

    },
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = 'COCOAPP'
            return args
        }),
        config.performance.hints('warning');
    }
})