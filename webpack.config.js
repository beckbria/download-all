const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        background_scripts: "./src/background_scripts/background.js",
        content_scripts: "./src/content_scripts/download-all.js",
        options: "./src/options/options.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        })
    ]
};
