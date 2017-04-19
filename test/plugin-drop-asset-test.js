import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";

const manifestFilename = "a.manifest";
const manifestFileContent = "source-content";
const manifestVariable = "manifest-variable";

test.cb("drop asset", t => {
  isDropped(true, asset => {
    t.is(asset, undefined);
    t.end();
  });
});

test.cb("keep asset", t => {
  isDropped(false, asset => {
    t.is(asset.source(), manifestFileContent);
    t.end();
  });
});

function isDropped(dropAsset, callback) {
  const assets = {};
  assets[manifestFilename] = {
    source: () => manifestFileContent
  };

  const compilationPluginEvent = (compilationEvent, alterAssets) => {
    if (compilationEvent === "html-webpack-plugin-alter-asset-tags") {
      const htmlPluginData = {
        head: []
      };

      alterAssets(htmlPluginData, (_, result) => {
        const asset = assets[manifestFilename];
        callback(asset);
      });
    }
  };

  const pluginEvent = (compilerEvent, compile) => {
    const compilation = {
      plugin: compilationPluginEvent,
      assets: assets
    };

    compile(compilation);
  };

  const fakeCompiler = { plugin: pluginEvent };

  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    filename: manifestFilename,
    manifestVariable: manifestVariable,
    dropAsset: dropAsset
  });

  plugin.plugins = [
    {
      apply: () => {}
    }
  ];

  plugin.apply(fakeCompiler);
}
