const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");

class InlineChunkManifestHtmlWebpackPlugin {
  constructor(options) {
    options = options || {};

    this.manifestFilename = options.filename || "manifest.json";
    this.manifestVariable = options.manifestVariable || "webpackManifest";
    this.chunkManifestVariable = options.chunkManifestVariable ||
      "webpackChunkManifest";
    this.dropAsset = options.dropAsset || false;

    this.plugins = [
      new ChunkManifestPlugin({
        filename: this.manifestFilename,
        manifestVariable: this.manifestVariable
      })
    ];
  }

  apply(compiler) {
    this.applyDependencyPlugins(compiler);

    const manifestFilename = this.manifestFilename;
    const manifestVariable = this.manifestVariable;
    const chunkManifestVariable = this.chunkManifestVariable;
    const dropAsset = this.dropAsset;

    compiler.plugin("compilation", compilation => {
      compilation.plugin(
        "html-webpack-plugin-alter-asset-tags",
        (htmlPluginData, callback) => {
          const asset = compilation.assets[manifestFilename];

          if (asset) {
            const newTag = {
              tagName: "script",
              closeTag: true,
              attributes: {
                type: "text/javascript"
              },
              innerHTML: `window.${manifestVariable}=${asset.source()}`
            };

            htmlPluginData.head.unshift(newTag);

            if (dropAsset) {
              delete compilation.assets[manifestFilename];
            }
          }

          callback(null, htmlPluginData);
        }
      );

      compilation.plugin(
        "html-webpack-plugin-before-html-generation",
        (htmlPluginData, callback) => {
          const asset = compilation.assets[manifestFilename];

          if (asset) {
            htmlPluginData.assets[
              chunkManifestVariable
            ] = `<script type="text/javascript">window.${manifestVariable}=${asset.source()}</script>`;
          }

          callback(null, htmlPluginData);
        }
      );
    });
  }

  applyDependencyPlugins(compiler) {
    this.plugins.forEach(plugin => plugin.apply.call(plugin, compiler));
  }
}

module.exports = InlineChunkManifestHtmlWebpackPlugin;
