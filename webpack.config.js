const path = require('path');
const Webpack = require('webpack');
const resolve = dir => path.resolve(__dirname, dir);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const entry = require('./config/entry');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack5');
const template = './www/template.html'; // 主入口文档
const config = {
    entry: Object.assign({
        main: './src/main.ts'
    }, entry),
    resolve: {
        extensions: ['.ts', '.tsx', '.css', '.less', '.js', '.vue'],
        fallback: {
            "path": require.resolve("path-browserify")
        },
        // 设置别名
        alias: {
            '@': resolve('./src') // 这样配置后 @ 可以指向 src 目录
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                }, ],
            },
            {
                test: /\.png|jpg|gif|jpeg|svg/,
                type: 'asset/resource',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'images/[base]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.ts|js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }, ],
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [{
                        loader: 'raw-loader',
                    },
                    {
                        loader: 'glslify-loader',
                    }
                ]
            },
            {
                test: /\.(wgsl)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'raw-loader',
                }]
            },
            {
                test: /\.css|less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['postcss-preset-env', {}]
                                ],
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                    },
                ],
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        // 全局注入 Vue, 避免在每个 .vue 文件中重复引入
        new Webpack.ProvidePlugin({
            Vue: ['vue/dist/vue.esm.js', 'default'],
        }),
        new HtmlWebpackPlugin({
            template,
            title: '可视化实战',
            chunks: ['main'],
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            linkType: 'text/css',
            filename: '[name].css',
            chunkFilename: '[id]_[chunkhash:8].css',
        })
    ],
    output: {
        clean: true,
        globalObject: 'this',
        filename: '[name].bundle_[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist'),
    }
};
// 编译案例模块
Object.keys(entry).forEach(key => {
    config.plugins.push(new HtmlWebpackPlugin({
        template,
        chunks: [key],
        filename: `${key}.html`
    }));
})
module.exports = config;
