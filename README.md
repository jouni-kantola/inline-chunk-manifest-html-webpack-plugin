# Inline Chunk Manifest HTML Webpack Plugin
Extension plugin for `html-webpack-plugin` to inline webpack chunk manifest. Use together with:
- `chunk-manifest-webpack-plugin` to extract chunks from manifest
- `inline-manifest-webpack-plugin` to inline manifest (in contrast to chunk manifest, which this plugin does)

## Example output
Script tag to assign global webpack manifest variable, injected in `<head>`.
```html
<head>
  <script>window.webpackManifest={"0":"0.bcca8d49c0f671a4afb6.dev.js","1":"1.6617d1b992b44b0996dc.dev.js"}</script>
</head>
```

## Usage

### Install via npm/yarn
- `npm install inline-chunk-manifest-html-webpack-plugin --save-dev`
- `yarn add inline-chunk-manifest-html-webpack-plugin --dev`

### webpack.config.js
```javascript
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');

module.exports = {
  // your config values here
  plugins: [
    new ChunkManifestPlugin(),
    new HtmlWebpackPlugin({
        template: './index-template.ejs'
    }),
    // InlineChunkManifestHtmlWebpackPlugin defaults to:
    // { filename: 'manifest.json', manifestVariable: 'webpackManifest', chunkManifestVariable: 'webpackChunkManifest' }
    // match { filename, manifestVariable } with ChunkManifestPlugin
    new InlineChunkManifestHtmlWebpackPlugin(),
    new InlineManifestPlugin()
  ]
};
```

### Config
```javascript
const inlineChunkManifestConfig = {
  filename: 'manifest.json', // manifest.json is default; matches chunk-manifest-webpack-plugin
  manifestVariable: 'webpackManifest', // webpackManifest is default; matches chunk-manifest-webpack-plugin
  chunkManifestVariable: 'webpackChunkManifest' // webpackChunkManifest is default; use in html-webpack-plugin template
};

new InlineChunkManifestHtmlWebpackPlugin(inlineChunkManifestConfig)
```

### Defaults
Default chunk manifest is inlined into the head tag.

By default the chunk manifest options matches defaults from [chunk-manifest-webpack-plugin](https://github.com/soundcloud/chunk-manifest-webpack-plugin).
If `filename` and/or `manifestFilename` is set for `ChunkManifestPlugin` match the values for `InlineChunkManifestHtmlWebpackPlugin`.

### Explicit inject
When option `inject: false` is passed to `html-webpack-plugin` the content of the chunk manifest can be inlined matching the config option `chunkManifestVariable`.

Example template for `html-webpack-plugin`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <h1>My web site</h1>
    <%=htmlWebpackPlugin.files.webpackChunkManifest%>
    <%=htmlWebpackPlugin.files.webpackManifest%>
  </body>
</html>
```
