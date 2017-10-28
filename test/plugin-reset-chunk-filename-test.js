import test from "ava";

import ChunkManifestPlugin from "../src/chunk-manifest-webpack-plugin";

test.cb("generate asset for chunk manifest", t => {
  const chunkFilename = "[filename]";

  const chunk = {
    id: 1,
    hasRuntime: () => true,
    chunks: []
  };

  const thisCompilationPluginEvent = (compilationEvent, ensure) => {
    if (compilationEvent === "require-ensure") {
      const outputOptions = { chunkFilename };

      ensure.apply({ outputOptions }, [undefined, chunk]);

      t.is(outputOptions.chunkFilename, "__CHUNK_MANIFEST__");
    }
  };

  const compilationPluginEvent = (compilationEvent, ensure) => {
    if (compilationEvent === "require-ensure") {
      const outputOptions = { chunkFilename: "overwrite-this" };

      ensure.apply({ outputOptions }, ["", chunk]);

      t.is(outputOptions.chunkFilename, chunkFilename);
      t.end();
    }
  };

  const pluginEvent = (event, compile) => {
    const compilation = {
      mainTemplate: {
        plugin: undefined
      },
      assets: {}
    };

    if (event === "this-compilation") {
      compilation.mainTemplate.plugin = thisCompilationPluginEvent;
      compile(compilation);
    }

    if (event === "compilation") {
      compilation.mainTemplate.plugin = compilationPluginEvent;
      compile(compilation);
    }
  };

  const fakeCompiler = { plugin: pluginEvent };

  const plugin = new ChunkManifestPlugin();

  plugin.apply(fakeCompiler);
});
