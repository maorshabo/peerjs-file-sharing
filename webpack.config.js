var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:5000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src/index' // Your appʼs entry point
  ],
  output: {
    path: path.join(__dirname, 'js'),
    filename: 'bundle.js',
    publicPath:'/js/'
  },
  debug: true,
  devtool: 'sourcemaps',
  resolve: { extensions: [ '', '.js' ] },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: ['react-hot','babel-loader?presets[]=es2015&presets[]=react'],
        exclude: /node_modules/,
      },
      { test: /\.scss$/,loader: "style!css!sass" },
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
