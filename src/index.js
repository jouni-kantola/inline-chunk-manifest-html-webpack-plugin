function InlineChunkManifestHtmlWebpackPlugin(options) {
    options = options || {};
    this.manifestFilename = options.filename || "manifest.json";
    this.manifestVariable = options.manifestVariable || "webpackManifest";
    this.chunkManifestVariable = options.chunkManifestVariable || "webpackChunkManifest";
}

InlineChunkManifestHtmlWebpackPlugin.prototype.apply = function (compiler) {
    const manifestFilename = this.manifestFilename;
    const manifestVariable = this.manifestVariable;
    const chunkManifestVariable = this.chunkManifestVariable;

    compiler.plugin("compilation", function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
            const asset = compilation.assets[manifestFilename];

            if (asset) {
                const newTag = {
                    tagName: 'script',
                    closeTag: true,
                    attributes: {
                        type: 'text/javascript'
                    },
                    innerHTML: `window.${manifestVariable}=${asset.source()}`
                };

                htmlPluginData.head.unshift(newTag);
            }

            callback(null, htmlPluginData);
        });

        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
            const asset = compilation.assets[manifestFilename];

            if (asset) {
                htmlPluginData.assets[chunkManifestVariable] = `<script type="text/javascript">window.${manifestVariable}=${asset.source()}</script>`;
            }

            callback(null, htmlPluginData);
        });
    });
};

module.exports = InlineChunkManifestHtmlWebpackPlugin;
