import test from "ava";

import ChunkManifestPlugin from "../src/chunk-manifest-webpack-plugin";

test.cb("replace runtime's chunk manifest with lookup", t => {
  const chunkIdVariableName = "a-chunk-id-variable";
  const manifestVariable = "manifest-variable";
  const placeholder = `"__CHUNK_MANIFEST__"`;

  const runtimeSource = [
    "runtime-source-start",
    placeholder,
    ";",
    "runtime-source-end"
  ];

  let expected = [...runtimeSource];
  expected[1] = `window["${manifestVariable}"][${chunkIdVariableName}]`;

  const compilationPluginEvent = (name, ensure) => {
    const updatedSource = ensure(
      runtimeSource.join(""),
      undefined,
      undefined,
      chunkIdVariableName
    );
    t.is(updatedSource, expected.join(""));
    t.end();
  };

  const pluginEvent = (name, compile) => {
    const compilation = {
      outputOptions: {
        chunkFilename: ""
      },
      mainTemplate: {
        hooks: {
          requireEnsure: {
            tap: compilationPluginEvent
          }
        }
      }
    };

    compile(compilation);
  };

  const fakeCompiler = {
    hooks: {
      thisCompilation: {
        tap: () => {}
      },
      compilation: {
        tap: pluginEvent
      }
    }
  };

  const plugin = new ChunkManifestPlugin({
    manifestVariable
  });

  plugin.apply(fakeCompiler);
});
