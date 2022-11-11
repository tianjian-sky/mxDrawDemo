const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
console.log('env', process.env.NODE_ENV)
module.exports = {
    // /sample/vuebrowse
    publicPath: process.env.NODE_ENV === 'production' ? '/mxcad-browse' : '/',
    lintOnSave: false,
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new CopyPlugin([
                {
                    from: path.resolve(__dirname, './public'),
                    to: path.resolve(__dirname, './dist/public')
                }
            ])
        ]
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
        proxy: {
            '/api': {
                target: 'http://10.81.3.40:3000/',
                pathRewrite: { '^/api': '' }
            }
        },
        // host: '',
        port: 8088,
        https: false,
        hotOnly: false,
        before: app => { }
    }
};