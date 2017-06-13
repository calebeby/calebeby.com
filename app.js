const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const SpikeDatoCMS = require('spike-datocms')
const md = require('markdown-it')()

const locals = {}

const formatYear = date =>
  (new Date(date)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric'
  })

const formatMonth = date =>
  (new Date(date)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric'
  })

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
  plugins: [
    new SpikeDatoCMS({
      cache: '_data.json',
      addDataTo: locals,
      token: process.env.DATOCMS_TOKEN,
      models: [
        {
          type: 'skill',
          transform: skills => md.render(skills.content)
        },
        {
          type: 'resume_summary',
          transform: summary => {
            summary.content = md.render(summary.content)
            return summary
          }
        },
        {
          type: 'education',
          transform: education => {
            education.endDate = education.current ?
              'Present' :
              formatMonth(education.endDate)
            education.class = formatYear(education.class)
            education.startDate = formatMonth(education.startDate)
            return education
          }
        },
        {
          type: 'experience',
          transform: experience => {
            experience.endDate = experience.current ?
              'Present' :
              formatMonth(experience.endDate)
            experience.startDate = formatMonth(experience.startDate)
            experience.details = md.render(experience.details)
            return experience
          }
        }
      ]
    })
  ],
  reshape: htmlStandards({
    locals: ctx => {
      locals.pageId = pageId(ctx)
      return locals
    },
    minify: true
  }),
  postcss: cssStandards({
    browsers: '> 1%',
    appendPlugins: [require('postcss-property-lookup')],
    minify: true
  }),
  babel: jsStandards()
}
