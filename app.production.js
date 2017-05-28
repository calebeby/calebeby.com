const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const pageId = require('spike-page-id')

const locals = {}

module.exports = {
  devtool: false,
  reshape: htmlStandards({
    minify: true,
    locals: ctx => {
      locals.pageId = pageId(ctx)
      return locals
    }
  }),
  postcss: cssStandards({
    minify: true,
    browsers: '> 1%'
  })
}
