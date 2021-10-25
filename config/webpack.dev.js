const path = require('path');
const {
    merge
} = require('webpack-merge');
const common = require("../webpack.config.js");
module.exports = merge(common, {
    target: "web",
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
            '/sso/web/auth': {
                target: 'http://ssodemo.it.test.sankuai.com',
                secure: false,
                changeOrigin: true,
                logLevel: 'debug'
            },
            '/sc-proxy': {
                target: 'https://service-component.sankuai.com',
                secure: false,
                changeOrigin: true,
                logLevel: 'debug'
            }
        },
        contentBase: path.join(__dirname, '../www')
    }
});
