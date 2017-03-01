# Inline Chunk Manifest HTML Webpack Plugin
Plugin to inline webpack chunk manifest in `<head>`. Use together with `html-webpack-plugin`, `chunk-manifest-webpack-plugin` and `inline-manifest-webpack-plugin`.

## Usage
At the moment I think the use case is quite narrow. After I got feedback that there's use for this plugin, I decided to publish it to npm.
If the plugin matches your needs, then by all means, go ahead and use the it :-)

### Install via npm
`npm install inline-chunk-manifest-html-webpack-plugin --save-dev`

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
    new InlineChunkManifestHtmlWebpackPlugin(), // match { filename, manifestVariable } with ChunkManifestPlugin
    new InlineManifestPlugin()
  ]
};
```

### Config
By default the chunk manifest options matches defaults from [chunk-manifest-webpack-plugin](https://github.com/soundcloud/chunk-manifest-webpack-plugin).
If `filename` and/or `manifestFilename` is set for `ChunkManifestPlugin` match the config passed to `InlineChunkManifestHtmlWebpackPlugin`.

## Result
Script tag assigning global variable injected in `<head>`.
```html
<head>
  <script>window.webpackManifest={"0":"0.bcca8d49c0f671a4afb6.dev.js","1":"1.6617d1b992b44b0996dc.dev.js"}</script>
</head>
```
