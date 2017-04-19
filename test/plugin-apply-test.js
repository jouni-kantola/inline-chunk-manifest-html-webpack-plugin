import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";
import ChunkManifestPlugin from "chunk-manifest-webpack-plugin";

test("plugin and dependency plugins has apply", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin();
  const manifestPlugin = plugin.plugins[0];

  t.is(typeof plugin.apply, "function");
  t.is(typeof manifestPlugin.apply, "function");
});

test.cb("dependency plugins are applied", t => {
  t.plan(2);

  const fakeCompiler = { plugin: () => {} };

  const dependencyPlugin = {
    apply: compiler => {
      t.is(compiler, fakeCompiler);
    }
  };

  const anotherDependencyPlugin = {
    apply: compiler => {
      t.is(compiler, fakeCompiler);
      t.end();
    }
  };

  const plugin = new InlineChunkManifestHtmlWebpackPlugin();
  plugin.plugins = [dependencyPlugin, anotherDependencyPlugin];
  plugin.apply(fakeCompiler);
});
