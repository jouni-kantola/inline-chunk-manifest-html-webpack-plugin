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
  const compilation = {
    assets: {}
  };
  compilation.assets[manifestFilename] = {
    source: () => manifestFileContent
  };

  const pluginEvent = (event, emit) => {
    if (event === "emit") {
      emit(compilation, () => {
        const asset = compilation.assets[manifestFilename];
        callback(asset);
      });
    }
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
