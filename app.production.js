const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const Records = require('spike-records')
const fetch = require('node-fetch')

const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: [
    'tlapse/**/*',
    '**/*.template.sgr',
    '**/layout.sgr',
    '**/_*',
    '**/.*',
    'readme.md',
    'yarn.lock'
  ],
  reshape: htmlStandards({
    locals: ctx => {
      locals.pageId = pageId(ctx)
      return locals
    }
  }),
  postcss: cssStandards({
    browsers: '> 1%'
  }),
  babel: jsStandards()
}
