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
