module.exports = {
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
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          // loader: 'babel-loader',
          // use: [
          //   {
          //   }
          // ]
        }
      ]
    }
  }
};
