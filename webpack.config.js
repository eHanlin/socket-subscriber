var path = require('path');
var entry = ['./src/index'];

if (process.env.NODE_ENV === undefined) {
  entry.unshift('webpack/hot/only-dev-server');
  entry.unshift('webpack-dev-server/client?http://localhost:8080');
}

module.exports = { 
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    libraryTarget:'umd',
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

