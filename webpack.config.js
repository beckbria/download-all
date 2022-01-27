const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        background_scripts: "./src/background_scripts/background.js",
        content_scripts: "./src/content_scripts/download-all.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    }
};
