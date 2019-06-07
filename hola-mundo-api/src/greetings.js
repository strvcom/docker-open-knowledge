/* eslint-disable no-process-env */
'use strict'

const { knex: db } = require('./database')

const sendGreeting = async () => {
  const myFoos = await db.select('*').from('foo')

  return {
    env: process.env.NODE_ENV,
    message: 'Hola mundo!',
    myFoos,
  }
}

module.exports = sendGreeting
