/**
 * This dependency plugin is a fork of: 
 * chunk-manifest-webpack-plugin (https://github.com/soundcloud/chunk-manifest-webpack-plugin)
 * 
 * inline-chunk-manifest-html-webpack-plugin already enables inlining webpack's chunk manifest,
 * and therefor has been extracted.
 */

"use strict";

const RawSource = require("webpack-sources").RawSource;

class ChunkManifestPlugin {
  constructor(options) {
    options = options || {};
    this.manifestFilename = options.filename || "manifest.json";
    this.manifestVariable = options.manifestVariable || "webpackManifest";
  }

  apply(compiler) {
    const manifestFilename = this.manifestFilename;
    const manifestVariable = this.manifestVariable;
    let chunkFilename;

    compiler.plugin("this-compilation", compilation => {
      const mainTemplate = compilation.mainTemplate;
      mainTemplate.plugin("require-ensure", function(
        source,
        chunk,
        hash
        /*, chunkIdVariableName */
      ) {
        chunkFilename = this.outputOptions.chunkFilename;

        if (chunkFilename) {
          const chunkManifest = [chunk].reduce(function registerChunk(
            manifest,
            c
          ) {
            if (c.id in manifest) return manifest;

            if (c.hasRuntime()) {
              manifest[c.id] = undefined;
            } else {
              const assetFilename = mainTemplate.applyPluginsWaterfall(
                "asset-path",
                chunkFilename,
                {
                  hash,
                  chunk: c
                }
              );

              manifest[c.id] = assetFilename;
            }

            return c.chunks.reduce(registerChunk, manifest);
          },
          {});

          this.outputOptions.chunkFilename = "__CHUNK_MANIFEST__";

          compilation.assets[manifestFilename] = new RawSource(
            JSON.stringify(chunkManifest)
          );
        }

        return source;
      });
    });

    compiler.plugin("compilation", compilation => {
      const mainTemplate = compilation.mainTemplate;
      mainTemplate.plugin("require-ensure", function(
        source,
        chunk,
        hash,
        chunkIdVariableName
      ) {
        if (chunkFilename) {
          this.outputOptions.chunkFilename = chunkFilename;
        }

        const updatedSource = source.replace(
          /"__CHUNK_MANIFEST__"/,
          `window["${manifestVariable}"][${chunkIdVariableName}]`
        );

        return updatedSource;
      });
    });
  }
}

module.exports = ChunkManifestPlugin;
