import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";

test.cb("inject manifest in head", t => {
  const manifestFilename = "a.manifest";
  const manifestFileContent = "source-content";
  const manifestVariable = "manifest-variable";

  const compilationPluginEvent = (name, alterAssets) => {
    const htmlPluginData = {
      head: []
    };

    alterAssets(htmlPluginData, (_, result) => {
      t.is(result.head.length, 1);
      const asset = result.head[0];
      t.is(asset.tagName, "script");
      t.is(asset.closeTag, true);
      t.is(asset.attributes.type, "text/javascript");
      t.is(
        asset.innerHTML,
        `window.${manifestVariable}=${manifestFileContent}`
      );
      t.end();
    });
  };

  const pluginEvent = (name, compile) => {
    const assets = {};
    assets[manifestFilename] = {
      source: () => manifestFileContent
    };

    const compilation = {
      hooks: {
        htmlWebpackPluginAlterAssetTags: {
          tapAsync: compilationPluginEvent
        },
        htmlWebpackPluginBeforeHtmlGeneration: {
          tapAsync: () => {}
        }
      },
      assets: assets
    };

    compile(compilation);
  };

  const fakeCompiler = {
    hooks: {
      emit: {
        tapAsync: () => {}
      },
      compilation: {
        tap: pluginEvent
      }
    }
  };

  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    filename: manifestFilename,
    manifestVariable: manifestVariable
  });

  plugin.plugins = [{ apply: () => {} }];
  plugin.apply(fakeCompiler);
});
