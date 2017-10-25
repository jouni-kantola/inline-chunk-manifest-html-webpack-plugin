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
    let oldChunkFilename;

    compiler.plugin("this-compilation", function(compilation) {
      const mainTemplate = compilation.mainTemplate;
      mainTemplate.plugin("require-ensure", function(_, chunk, hash) {
        const filename =
          this.outputOptions.chunkFilename || this.outputOptions.filename;

        if (filename) {
          const chunkManifest = [chunk].reduce(function registerChunk(
            manifest,
            c
          ) {
            if (c.id in manifest) return manifest;

            const hasRuntime = typeof c.hasRuntime === "function"
              ? c.hasRuntime()
              : c.entry;

            if (hasRuntime) {
              manifest[c.id] = undefined;
            } else {
              manifest[
                c.id
              ] = mainTemplate.applyPluginsWaterfall("asset-path", filename, {
                hash: hash,
                chunk: c
              });
            }
            return c.chunks.reduce(registerChunk, manifest);
          }, {});

          oldChunkFilename = this.outputOptions.chunkFilename;
          this.outputOptions.chunkFilename = "__CHUNK_MANIFEST__";
          // mark as asset for emitting
          compilation.assets[manifestFilename] = new RawSource(
            JSON.stringify(chunkManifest)
          );
        }

        return _;
      });
    });

    compiler.plugin("compilation", function(compilation) {
      compilation.mainTemplate.plugin("require-ensure", function(
        _,
        chunk,
        hash,
        chunkIdVariableName
      ) {
        if (oldChunkFilename) {
          this.outputOptions.chunkFilename = oldChunkFilename;
        }

        return _.replace(
          '"__CHUNK_MANIFEST__"',
          `window["${manifestVariable}"][${chunkIdVariableName}]`
        );
      });
    });
  }
}

module.exports = ChunkManifestPlugin;
