const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: path.resolve(__dirname, "src", "index.jsx"),
        output: {
            filename: isDev ? "bundle.js" : "bundle.[contenthash].js",
            publicPath: "/"
        },
        resolve: { extensions: [ ".js", ".jsx" ] },
        module: {
            rules: [
                { test: /\.jsx?$/, exclude: /node_modules/, use: "babel-loader" },
                { test: /\.css$/i, use: [ "style-loader", "css-loader" ] },
                { test: /\.(png|jpg|svg|woff2?)$/, type: "asset/resource" }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                inject: "body"
            })
        ],
        devServer: {
            port: 3000,
            static: path.resolve(__dirname, "public"),
            historyApiFallback: true,
            hot: true,
            open: true,
        }
    }
}
