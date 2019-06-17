/* eslint-disable no-process-env */
'use strict'

const knex = require('knex')

const dbConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
}

const knexConnection = knex(dbConfig)

module.exports = {
  knex: knexConnection,
  dbConfig,
}
