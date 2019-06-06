/* eslint-disable no-undef */
'use strict'

const sendGreeting = require('../src/greetings')

test('Tests greeting to equal "Hola mundo!"', () => {
  const greeting = sendGreeting()

  expect(greeting).toMatchObject({
    message: 'Hola mundo!',
  })
})
