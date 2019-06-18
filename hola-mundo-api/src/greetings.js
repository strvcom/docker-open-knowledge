/* eslint-disable no-process-env */
'use strict'

const os = require('os')

const sendGreeting = () => ({
  env: process.env.NODE_ENV,
  message: 'Hola mundo!',
  hostname: `x${os.hostname}`,
})

module.exports = sendGreeting
