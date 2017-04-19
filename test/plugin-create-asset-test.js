import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";

test.cb("create asset", t => {
  const manifestFilename = "a.manifest";
  const manifestFileContent = "source-content";
  const manifestVariable = "manifest-variable";
  const chunkManifestVariable = "chunk-manifest-variable";

  const compilationPluginEvent = (compilationEvent, alterAssets) => {
    if (compilationEvent === "html-webpack-plugin-before-html-generation") {
      const htmlPluginData = {
        assets: {}
      };

      alterAssets(htmlPluginData, (_, result) => {
        const asset = htmlPluginData.assets[chunkManifestVariable];

        t.is(
          asset,
          `<script type="text/javascript">window.${manifestVariable}=${manifestFileContent}</script>`
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
    manifestVariable: manifestVariable,
    chunkManifestVariable: chunkManifestVariable
  });

  plugin.plugins = [{ apply: () => {} }];
  plugin.apply(fakeCompiler);
});
