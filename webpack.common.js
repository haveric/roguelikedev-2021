const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Roguelikedev 2021',
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'docs'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                include: path.resolve(__dirname, 'src/html'),
                type: 'asset/source',
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src/styles'),
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, 'src/img'),
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: path.resolve(__dirname, 'src/fonts'),
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                fonts: {
                    test: /[\\/]src[\\/]fonts[\\/]/,
                    name: 'fonts',
                    chunks: 'all',
                },
                html: {
                    test: /[\\/]src[\\/]html[\\/]/,
                    name: 'html',
                    chunks: 'all',
                },
                json: {
                    test: /[\\/]src[\\/]json[\\/]/,
                    name: 'json',
                    chunks: 'all',
                }
            }
        }
    }
};