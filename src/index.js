function InlineChunkManifestHtmlWebpackPlugin(options) {
    options = options || {};
    this.manifestFilename = options.filename || "manifest.json";
    this.manifestVariable = options.manifestVariable || "webpackManifest";
}

InlineChunkManifestHtmlWebpackPlugin.prototype.apply = function (compiler) {
    const manifestFilename = this.manifestFilename;
    const manifestVariable = this.manifestVariable;

    compiler.plugin("compilation", function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
            const asset = compilation.assets[manifestFilename];

            if (asset) {
                const newTag = {
                    tagName: 'script',
                    closeTag: true,
                    innerHTML: `window.${manifestVariable}=${asset.source()}`
                };

                htmlPluginData.head.unshift(newTag);
            }

            callback(null, htmlPluginData);

        });
    });
};

module.exports = InlineChunkManifestHtmlWebpackPlugin;
