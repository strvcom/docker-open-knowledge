/* eslint-disable no-process-exit, no-process-env, no-console */

'use strict'

const Koa = require('koa')
const sendGreeting = require('./greetings.js')
const { knex: db } = require('./database')

const app = new Koa()

app.use(ctx => {
  ctx.body = sendGreeting()
})

const port = process.env.PORT || 3000

const server = app.listen(port, async () => {
  try {
    await db.raw('select 1+1 as result')
    console.log('==> 📑 DB connected and ready to be used.', new Date().toISOString())
  } catch (err) {
    console.error('Error connecting to DB ❌.', new Date().toISOString())
    shutdown()
  }

  console.log(`==> 🌎 Server listening on port ${port}.`, new Date().toISOString())
})

// process signal management
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
  server.close(async function onServerClosed(err) {
    // 💥
    console.log('HTTP server closed', new Date().toISOString())

    await db.destroy()
    console.log('Database connection closed', new Date().toISOString())

    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}
