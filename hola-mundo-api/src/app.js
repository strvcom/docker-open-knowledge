/* eslint-disable no-process-exit, no-process-env, no-console */

'use strict'

const Koa = require('koa')
const sendGreeting = require('./greetings')

const app = new Koa()

app.use(ctx => {
  ctx.body = sendGreeting()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`==> 🌎 Server listening on port ${port}.`)
})

process.on('SIGINT', function onSigint() {
  console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString())
  shutdown()
})

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString())
  shutdown()
})

// shut down server
function shutdown() {
  app.close(function onServerClosed(err) {
    // Close DB connections
    // Send FIN packages for long-lived HTTP connections
    // 💥
    if (err) {
      console.error(err)
      process.exitCode = 1
    }
    process.exit()
  })
}
