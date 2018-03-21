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

  const fakeCompiler = {
    hooks: {
      emit: {
        tapAsync: (name, handler) => {
          handler(compilation, () => {
            const asset = compilation.assets[manifestFilename];
            callback(asset);
          });
        }
      },
      compilation: {
        tap: (name, handler) => {}
      }
    }
  };

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
