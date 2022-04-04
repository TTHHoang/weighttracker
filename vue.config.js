module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    //change to path on website server, it's now on the localhost path
    ? '/websitedemo/weight-tracker/'  // This is whatever your path from the root is
    //path when working on localdev
    : '/',
  configureWebpack: {
    externals: {
      moment: 'moment'
    }
  },
}
