'use strict'

const Koa = require('koa')
const sendGreeting = require('./greetings')

const app = new Koa()

app.use(ctx => {
  ctx.body = sendGreeting()
})

// eslint-disable-next-line no-process-env
const port = process.env.PORT || 3000

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`==> 🌎  Server listening on port ${port}.`)
})
