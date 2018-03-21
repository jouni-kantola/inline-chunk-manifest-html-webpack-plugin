import test from "ava";

import ChunkManifestPlugin from "../src/chunk-manifest-webpack-plugin";

test.cb("generate asset for chunk manifest", t => {
  const chunkFilename = "[filename]";

  const chunk = {
    id: 1,
    hasRuntime: () => true,
    chunks: [],
    groupsIterable: []
  };

  const thisCompilationPluginEvent = (name, ensure) => {
    ensure(undefined, chunk);
  };

  const compilationPluginEvent = (name, ensure) => {
    ensure("", chunk);
  };

  const pluginThisCompilationEvent = (name, compile) => {
    const compilation = {
      mainTemplate: {
        hooks: {
          requireEnsure: {
            tap: thisCompilationPluginEvent
          }
        }
      },
      outputOptions: {
        chunkFilename
      },
      assets: {}
    };

    compile(compilation);

    t.is(compilation.outputOptions.chunkFilename, "__CHUNK_MANIFEST__");
  };

  const pluginCompilationEvent = (name, compile) => {
    const compilation = {
      mainTemplate: {
        hooks: {
          requireEnsure: {
            tap: compilationPluginEvent
          }
        }
      },
      outputOptions: {
        chunkFilename: "overwrite-this"
      },
      assets: {}
    };

    compile(compilation);

    t.is(compilation.outputOptions.chunkFilename, chunkFilename);
    t.end();
  };

  const fakeCompiler = {
    hooks: {
      thisCompilation: {
        tap: pluginThisCompilationEvent
      },
      compilation: {
        tap: pluginCompilationEvent
      }
    }
  };

  const plugin = new ChunkManifestPlugin();

  plugin.apply(fakeCompiler);
});
