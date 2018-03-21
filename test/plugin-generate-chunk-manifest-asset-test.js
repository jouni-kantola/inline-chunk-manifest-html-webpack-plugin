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
    groupsIterable: [
      {
        chunks: [
          {
            id: 2,
            hasRuntime: () => false,
            groupsIterable: []
          },
          {
            id: 2
          }
        ]
      }
    ]
  };

  let expected = {};
  expected[manifestFilename] = new RawSource(
    JSON.stringify({
      "2": "2-a1234.js"
    })
  );

  const compilationPluginEvent = (name, ensure) => {
    ensure(undefined, chunk, "a1234");
  };

  const getAssetPath = (filename, data) => {
    return filename.replace(
      filenamePlaceholder,
      `${data.chunk.id}-${data.hash}.js`
    );
  };

  const pluginEvent = (name, compile) => {
    const compilation = {
      mainTemplate: {
        hooks: {
          requireEnsure: {
            tap: compilationPluginEvent
          }
        },
        getAssetPath
      },
      assets: {},
      outputOptions: {
        chunkFilename: filenamePlaceholder
      }
    };

    compile(compilation);

    t.deepEqual(compilation.assets, expected);
    t.end();
  };

  const fakeCompiler = {
    hooks: {
      thisCompilation: {
        tap: pluginEvent
      },
      compilation: {
        tap: () => {}
      }
    }
  };

  const plugin = new ChunkManifestPlugin({
    filename: manifestFilename
  });

  plugin.apply(fakeCompiler);
});
