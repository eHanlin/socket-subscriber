var path = require('path')

module.exports = { 
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index'
  ],  
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },  
  plugins: [

  ],  
  module: {
    loaders: [
      {  
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }
    ] 
  }   
}    

