const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const {UglifyJsPlugin} = require('webpack').optimize

module.exports = {
  // Disable source maps
  devtool: false,
  // Minify js
  plugins: [],
  // Minify html and css
  reshape: htmlStandards({minify: true}),
  postcss: cssStandards({
    minify: true,
    warnForDuplicates: false // Cssnano includes autoprefixer
  })
}
