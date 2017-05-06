const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const Records = require('spike-records')
const fetch = require('node-fetch')

var md = require('markdown-it')('commonmark')

const locals = {
  md: text => md.render(text)
}

const getData = path =>
  fetch(`https://site-api.datocms.com/${path}`, {
    headers: {
      accept: 'application/json',
      authorization: process.env.DATOCMS_TOKEN
    }
  })
    .then(data => data.json())
    .then(data => data.data)

const getPosts = () =>
  getData('items?filter[type]=happening').then(posts => {
    return posts.map(post => {
      return post.attributes
    })
  })

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: [
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
  plugins: [
    new Records({
      addDataTo: locals,
      happenings: {
        data: getPosts(),
        template: {
          path: 'views/post.template.sgr',
          output: post => {
            return `posts/${post.slug}.html`
          }
        }
      }
    })
  ],
  postcss: cssStandards(),
  babel: jsStandards()
}
