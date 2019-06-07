'use strict'

const { dbConfig } = require('./index.js')

module.exports = {
  development: {
    client: dbConfig.client,
    connection: 'postgresql://postgres:postgres@hola-mundo-db:5432/hola-mundo-db',
  },
  production: {
    client: dbConfig.client,
    connection: dbConfig.connection,
  },
}
