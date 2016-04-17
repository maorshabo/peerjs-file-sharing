var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var PORT = 5000;
new WebpackDevServer(webpack(config), {
  contentBase: 'src',
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(PORT, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + PORT);
});
