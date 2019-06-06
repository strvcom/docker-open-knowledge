/* eslint-disable no-process-env */
'use strict'

const sendGreeting = () => ({
  env: process.env.NODE_ENV,
  message: 'Hola mundo!',
})

module.exports = sendGreeting
