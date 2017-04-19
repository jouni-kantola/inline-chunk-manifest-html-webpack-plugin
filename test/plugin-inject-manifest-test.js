import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";

test.cb("inject manifest in head", t => {
  const manifestFilename = "a.manifest";
  const manifestFileContent = "source-content";
  const manifestVariable = "manifest-variable";

  const compilationPluginEvent = (compilationEvent, alterAssets) => {
    if (compilationEvent === "html-webpack-plugin-alter-asset-tags") {
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
    }
  };

  const pluginEvent = (compilerEvent, compile) => {
    t.is(compilerEvent, "compilation");

    const assets = {};
    assets[manifestFilename] = {
      source: () => manifestFileContent
    };

    const compilation = {
      plugin: compilationPluginEvent,
      assets: assets
    };

    compile(compilation);
  };

  const fakeCompiler = { plugin: pluginEvent };

  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    filename: manifestFilename,
    manifestVariable: manifestVariable
  });

  plugin.plugins = [{ apply: () => {} }];
  plugin.apply(fakeCompiler);
});
