const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require("../webpack.config.js");
module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new BundleAnalyzerPlugin()
    ],
    optimization: {
        // 压缩输出结果，usedExports开启后会移除未被使用的成员
        minimize: true,
    }
});
