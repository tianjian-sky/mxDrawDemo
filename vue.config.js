module.exports = {
  // /sample/vuebrowse
  publicPath: process.env.NODE_ENV === 'production' ? '/sample/vuebrowse' :  '/',
  lintOnSave: false,
  configureWebpack: {
		devtool: 'source-map',
    
    //resolve:{
    //  alias:{
    //      path:false,
    //      fs:false
    //  }
	},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    disableHostCheck: true,
    // host: '',
    port: 8088,
    https: false,
    hotOnly: false,
   before: app => {}
  }
};