# Inline Chunk Manifest HTML Webpack Plugin
Extension plugin for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to inline webpack's chunk manifest. Defaults to inline in `<head>` tag.

[![Build Status](https://travis-ci.org/jouni-kantola/inline-chunk-manifest-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/jouni-kantola/inline-chunk-manifest-html-webpack-plugin)

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
    new HtmlWebpackPlugin({
        template: './index-template.ejs'
    }),
    // InlineChunkManifestHtmlWebpackPlugin defaults to:
    // { filename: 'manifest.json', manifestVariable: 'webpackManifest', chunkManifestVariable: 'webpackChunkManifest', dropAsset: false }
    new InlineChunkManifestHtmlWebpackPlugin()
  ]
};
```

### Config
```javascript
const inlineChunkManifestConfig = {
  filename: 'manifest.json', // manifest.json is default
  manifestVariable: 'webpackManifest', // webpackManifest is default
  chunkManifestVariable: 'webpackChunkManifest', // webpackChunkManifest is default; use in html-webpack-plugin template
  dropAsset: true, // false is default; use to skip output of the chunk manifest asset (removes manifest.json)
  manifestPlugins: [/* override default chunk manifest plugin(s) */],
  extractManifest: false // true is default. When set to false, manifestPlugins (incl default) is not applied
};

new InlineChunkManifestHtmlWebpackPlugin(inlineChunkManifestConfig)
```

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
  </body>
</html>
```

### Override default chunk manifest plugin
To use plugins like [webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin) you can override the default plugin used to extract the webpack chunk manifest. To do this, you can do either of below configs:

`inline-chunk-manifest-html-webpack-plugin` apply dependency plugins:
```javascript
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');

module.exports = {
  /* webpack config */
  plugins: [
    /* more plugins goes here */

    new InlineChunkManifestHtmlWebpackPlugin({
      manifestPlugins: [
        new WebpackManifestPlugin()
      ],
      manifestVariable: "manifest"
    }),
    new HtmlWebpackPlugin({
        template: './index-template.ejs'
    })
    /* more plugins goes here */
  ]
};
```

Plugins applied separately:
```javascript
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');

module.exports = {
  /* webpack config */
  plugins: [
    /* more plugins goes here */
    new WebpackManifestPlugin(),
    new InlineChunkManifestHtmlWebpackPlugin({
      manifestVariable: "manifest",
      extractManifest: false
    }),
    new HtmlWebpackPlugin({
        template: './index-template.ejs'
    })
    /* more plugins goes here */
  ]
};
```
