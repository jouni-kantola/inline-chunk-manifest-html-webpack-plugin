import test from "ava";
import InlineChunkManifestHtmlWebpackPlugin from "../src/";
import ChunkManifestPlugin from "chunk-manifest-webpack-plugin";

test("has defaults", t => {
  const expected = {
    manifestFilename: "manifest.json",
    manifestVariable: "webpackManifest"
  };
  const plugin = new InlineChunkManifestHtmlWebpackPlugin();
  t.is(plugin.manifestFilename, expected.manifestFilename);
  t.is(plugin.manifestVariable, expected.manifestVariable);
  t.is(plugin.chunkManifestVariable, "webpackChunkManifest");
  t.is(plugin.dropAsset, false);

  t.is(plugin.plugins.length, 1);

  const manifestPlugin = plugin.plugins[0];
  t.true(manifestPlugin instanceof ChunkManifestPlugin);
  t.is(manifestPlugin.manifestFilename, expected.manifestFilename);
  t.is(manifestPlugin.manifestVariable, expected.manifestVariable);
});

test("override drop asset", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({ dropAsset: true });
  t.is(plugin.dropAsset, true);
});

test("extract manifest as boolean", t => {
  const error = t.throws(() => {
    const plugin = new InlineChunkManifestHtmlWebpackPlugin({
      extractManifest: 1
    });
  }, TypeError);

  t.is(error.message, "Extract manifest must be boolean");
});

test("default extract manifest", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin();

  t.is(plugin.extractManifest, true);
});

test("disable plugins", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    extractManifest: false
  });

  t.is(plugin.extractManifest, false);
});

test("override manifest filename", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    filename: "another.file"
  });
  const manifestPlugin = plugin.plugins[0];

  t.is(plugin.manifestFilename, "another.file");
  t.is(manifestPlugin.manifestFilename, "another.file");
});

test("override manifest variable", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    manifestVariable: "a-variable"
  });
  const manifestPlugin = plugin.plugins[0];

  t.is(plugin.manifestVariable, "a-variable");
  t.is(manifestPlugin.manifestVariable, "a-variable");
});

test("override chunk manifest variable", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    chunkManifestVariable: "another-variable"
  });

  t.is(plugin.chunkManifestVariable, "another-variable");
});

test("fallback to default chunk manifest plugin", t => {
  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    manifestPlugins: []
  });

  t.is(plugin.plugins.length, 1);
  t.true(plugin.plugins[0] instanceof ChunkManifestPlugin);
});

test("ensure overriden plugins handle apply", t => {
  const manifestPlugin = { override: true, apply: () => {} };
  const anotherManifestPlugin = { override: true, apply: () => {} };

  const plugin = new InlineChunkManifestHtmlWebpackPlugin({
    manifestPlugins: [manifestPlugin, anotherManifestPlugin]
  });

  t.deepEqual(plugin.plugins, [manifestPlugin, anotherManifestPlugin]);
});

test("array of plugins required", t => {
  const error = t.throws(() => {
    const plugin = new InlineChunkManifestHtmlWebpackPlugin({
      manifestPlugins: 1
    });
  }, TypeError);

  t.is(
    error.message,
    "Overriden manifest plugin(s) must be specified as array; [new Plugin1(), new Plugin1(), ...]"
  );
});
