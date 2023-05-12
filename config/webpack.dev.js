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
        port: 8080,
        open: true,
        https: false,
        historyApiFallback: true,
        static: [
            {
                publicPath: '/',
                directory: path.join(process.cwd(), 'src/assets'),
            }
        ],
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
            },
            '/mock': {
                target: 'http://localhost:3000/',
                secure: false,
                changeOrigin: true,
                logLevel: 'debug'
            }
        }
    }
});
