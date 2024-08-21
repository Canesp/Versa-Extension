const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        "popup": path.resolve("src/popup/popup.tsx"),
        "background": path.resolve("src/background/background.ts"),
        "content": path.resolve("src/content/index.tsx"),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/
            },
            {
                use: ["style-loader", "css-loader", {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            ident: "postcss",
                            plugins: [tailwindcss, autoprefixer],
                        }
                    }
                }],
                test: /\.css$/i,
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve("src/static"), to: path.resolve("dist") },
                { from: path.resolve("src/assets"), to: path.resolve("dist") },
            ]
        }),
        new HtmlPlugin({
            title: "Versa - Popup",
            filename: "popup.html",
            chunks: ["popup"],
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].js",
    }
}