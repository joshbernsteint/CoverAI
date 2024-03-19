

module.exports = {
    resolve: {
      fallback: {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
      } 
    },
    // node: {
    //   fs: 'empty',
    //   net: 'empty',
    //   tls: 'empty'
    // },
}