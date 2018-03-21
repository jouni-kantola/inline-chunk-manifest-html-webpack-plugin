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

    compiler.hooks.thisCompilation.tap("ChunkManifestPlugin", compilation => {
      const mainTemplate = compilation.mainTemplate;
      mainTemplate.hooks.requireEnsure.tap("ChunkManifestPlugin", (
        source,
        chunk,
        hash
        /*, chunkIdVariableName */
      ) => {
        chunkFilename = compilation.outputOptions.chunkFilename;

        if (chunkFilename) {
          const chunkManifest = [chunk].reduce(function registerChunk(
            manifest,
            c
          ) {
            if (c.id in manifest) return manifest;

            if (c.hasRuntime()) {
              manifest[c.id] = undefined;
            } else {
              const assetFilename = mainTemplate.getAssetPath(chunkFilename, {
                hash: hash,
                chunk: c
              });

              manifest[c.id] = assetFilename;
            }

            const cGroups = Array.from(c.groupsIterable);
            const cGroupsChildren = cGroups.map(group => group.chunks);
            const unsortedChunks = cGroupsChildren.reduce(
              (chunksArray, childrens) => chunksArray.concat(childrens),
              []
            );

            const chunks = Array.from(new Set(unsortedChunks));

            return chunks.reduce(registerChunk, manifest);
          },
          {});

          compilation.outputOptions.chunkFilename = "__CHUNK_MANIFEST__";

          compilation.assets[manifestFilename] = new RawSource(
            JSON.stringify(chunkManifest)
          );
        }

        return source;
      });
    });

    compiler.hooks.compilation.tap("ChunkManifestPlugin", compilation => {
      const mainTemplate = compilation.mainTemplate;
      mainTemplate.hooks.requireEnsure.tap(
        "ChunkManifestPlugin",
        (source, chunk, hash, chunkIdVariableName) => {
          if (chunkFilename) {
            compilation.outputOptions.chunkFilename = chunkFilename;
          }

          const updatedSource = source.replace(
            /"__CHUNK_MANIFEST__"/,
            `window["${manifestVariable}"][${chunkIdVariableName}]`
          );

          return updatedSource;
        }
      );
    });
  }
}

module.exports = ChunkManifestPlugin;
