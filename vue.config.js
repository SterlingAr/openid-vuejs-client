const path = require('path');
module.exports = {
  // chainWebpack: config =>
  // {
  //   config.module
  //       .rule('ts-files')
  //       .test(/\.tsx?$/)
  //       .use('ts-loader').end();
  // },
  devServer: {
    disableHostCheck: true,
    port: 8080
  },
  configureWebpack: {
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {loader: 'ts-loader'}
          ],
        }
      ]
    }
  }
};
