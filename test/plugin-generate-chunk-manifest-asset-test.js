import test from "ava";

import ChunkManifestPlugin from "../src/chunk-manifest-webpack-plugin";

const RawSource = require("webpack-sources").RawSource;

test.cb("generate asset for chunk manifest", t => {
  const manifestFilename = "a.manifest";
  const filenamePlaceholder = "[filename]";
  const moduleSource = "";

  const chunk = {
    id: 1,
    hasRuntime: () => true,
    chunks: [
      {
        id: 2,
        hasRuntime: () => false,
        chunks: []
      },
      {
        id: 2
      }
    ]
  };

  let expected = {};
  expected[manifestFilename] = new RawSource(
    JSON.stringify({
      "2": "2-a1234.js"
    })
  );

  const compilationPluginEvent = (compilationEvent, ensure) => {
    if (compilationEvent === "require-ensure") {
      ensure.apply(
        {
          outputOptions: {
            chunkFilename: filenamePlaceholder
          }
        },
        [undefined, chunk, "a1234"]
      );
    }
  };

  const applyPluginsWaterfall = (event, filename, data) => {
    if (event === "asset-path")
      return filename.replace(
        filenamePlaceholder,
        `${data.chunk.id}-${data.hash}.js`
      );

    t.fail();
  };

  const pluginEvent = (event, compile) => {
    if (event === "this-compilation") {
      const compilation = {
        mainTemplate: {
          plugin: compilationPluginEvent,
          applyPluginsWaterfall
        },
        assets: {}
      };

      compile(compilation);

      t.deepEqual(compilation.assets, expected);
      t.end();
    }
  };

  const fakeCompiler = { plugin: pluginEvent };

  const plugin = new ChunkManifestPlugin({
    filename: manifestFilename
  });

  plugin.apply(fakeCompiler);
});
